import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { AnalyticsDailySessionCount } from './../interfaces/analyticsSession.interface';
import { Client, Server } from 'socket.io';
import { AnalyticsEventDto } from './../../analytics/dto/analyticsEvent.dto';
import { AnalyticsDailySessionCountToken } from '../../analytics/constants';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { v4 } from 'uuid';
import * as UaParser from 'ua-parser-js';
import { AnalyticsService } from './../../analytics/services/analytics.service';

export const EVENT_PAGEVIEW = 'pageview';

@WebSocketGateway(3001)
export class PageviewGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private activeSessions: { [key: string]: any } = {};

  private liveAnalyticsSubscribers: {
    [key: string]: Subject<WsResponse<any>>;
  } = {};

  private livePageviewsTodaySubscribers: {
    [key: string]: Subject<WsResponse<number>>;
  } = {};

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(AnalyticsDailySessionCountToken)
    private readonly dailySessionModel: Model<AnalyticsDailySessionCount>,
    private readonly analyticsService: AnalyticsService,
  ) {}

  handleConnection(client: any, ...args: any[]) {
    if (args && args.length > 0) {
      const headers = args[0].headers;
      if (headers['cf-ipcountry']) {
        client.userLocation = headers['cf-ipcountry'];
      }
      if (headers['user-agent']) {
        const ua = UaParser(headers['user-agent']);
        if (ua) {
          const browser = ua.browser;
          client.browser = browser;
          const device = ua.device;
          client.device = device;
        }
      }
    }
    client.id = v4();
  }

  async handleDisconnect(client: any) {
    console.log('disconnect');
    const session = this.activeSessions[client.id];
    if (session) {
      if (session.timestamp) {
        session.duration = new Date().getTime() - session.timestamp.getTime();
      }

      await session.save();
      delete this.activeSessions[client.id];
    }
    const liveAnalyticsSubscription = this.liveAnalyticsSubscribers[client.id];
    if (liveAnalyticsSubscription) {
      liveAnalyticsSubscription.complete();
      delete this.liveAnalyticsSubscribers[client.id];
    }
    const livePageviewsTodaySubscription = this.livePageviewsTodaySubscribers[
      client.id
    ];
    if (livePageviewsTodaySubscription) {
      livePageviewsTodaySubscription.complete();
      delete this.livePageviewsTodaySubscribers[client.id];
    }
    Promise.all([this.notifyAboutLiveAnalytics()]);
  }

  @SubscribeMessage('event')
  async onAnalyticsEvent(client: any, data: AnalyticsEventDto) {
    var today = new Date(new Date().toDateString());
    if (!this.activeSessions[client.id]) {
      this.activeSessions[client.id] = data.userLocation;
    }
    if (data.type === 'pageview') {
      const inc = { count: 1 };
      inc[`pages.${data.pageLocation}`] = 1;
      inc[`locations.${data.userLocation}`] = 1;
      inc[`browsers.${client.browser.name}`] = 1;

      console.log(client.browser);

      await this.dailySessionModel
        .update({ day: today }, { $inc: inc }, { upsert: true })
        .exec();
    }
    if (data.type === 'affiliateClick') {
      const inc = {
        [`affiliateClick.${data.subType}`]: 1,
      };
      await this.dailySessionModel
        .update({ day: today }, { $inc: inc }, { upsert: true })
        .exec();
    }
    if (data.type === 'affiliateView') {
      const inc = {
        [`affiliateView.${data.subType}`]: 1,
      };
      await this.dailySessionModel
        .update({ day: today }, { $inc: inc }, { upsert: true })
        .exec();
    }

    Promise.all([
      this.notifyAboutLiveAnalytics(),
      this.notifyAboutLivePageviewsToday(),
    ]);
  }

  @SubscribeMessage('registerForLiveAnalytics')
  registerUserForLiveAnalytics(client: Client): Observable<WsResponse<any>> {
    console.log('subscribed');
    var subject = new BehaviorSubject<WsResponse<any>>({
      event: 'updateLiveAnalytics',
      data: Object.values(this.activeSessions) as any,
    });
    this.liveAnalyticsSubscribers[client.id] = subject;

    return subject.asObservable();
  }

  @SubscribeMessage('registerForLivePageviewsToday')
  registerUserForLivePageviewsToday(
    client: Client,
  ): Observable<WsResponse<number>> {
    console.log('subscribed');
    var subject = new BehaviorSubject<WsResponse<number>>({
      event: 'updateLivePageviewsToday',
      data: 0,
    });
    this.livePageviewsTodaySubscribers[client.id] = subject;

    this.analyticsService.getPageviewsToday().then(pageViewsToday => {
      subject.next({
        event: 'updateLivePageviewsToday',
        data: pageViewsToday,
      });
    });

    return subject.asObservable();
  }

  private async notifyAboutLiveAnalytics() {
    Object.values(this.liveAnalyticsSubscribers).forEach(subject => {
      subject.next({
        event: 'updateLiveAnalytics',
        data: Object.values(this.activeSessions),
      });
    });
  }

  private async notifyAboutLivePageviewsToday() {
    const subscribers = Object.values(this.livePageviewsTodaySubscribers);
    if (subscribers.length > 0) {
      const pageViewsToday = await this.analyticsService.getPageviewsToday();
      Object.values(this.livePageviewsTodaySubscribers).forEach(subject => {
        subject.next({
          event: 'updateLivePageviewsToday',
          data: pageViewsToday,
        });
      });
    }
  }
}
