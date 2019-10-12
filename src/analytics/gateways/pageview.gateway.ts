import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import {
  AnalyticsSession,
  AnalyticsEvent,
} from './../interfaces/analyticsSession.interface';
import { Client, Server } from 'socket.io';
import { AnalyticsEventDto } from './../../analytics/dto/analyticsEvent.dto';
import {
  AnalyticsSessionToken,
  AnalyticsEventToken,
} from '../../analytics/constants';
import { Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { Roles } from './../../authentication/decorators/roles.decorator';
import { Subject, Observable, BehaviorSubject } from 'rxjs';
import { ObjectId } from 'bson';
import { v4 } from 'uuid';
import * as UaParser from 'ua-parser-js';
import { AnalyticsService } from './../../analytics/services/analytics.service';

export const EVENT_PAGEVIEW = 'pageview';

@WebSocketGateway(3001)
export class PageviewGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private activeSessions: { [key: string]: Partial<AnalyticsSession> } = {};

  private liveAnalyticsSubscribers: {
    [key: string]: Subject<WsResponse<Partial<AnalyticsSession>[]>>;
  } = {};

  private livePageviewsTodaySubscribers: {
    [key: string]: Subject<WsResponse<number>>;
  } = {};

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject(AnalyticsSessionToken)
    private readonly sessionModel: Model<AnalyticsSession>,
    @Inject(AnalyticsEventToken)
    private readonly eventModel: Model<AnalyticsEvent>,
    private analyticsService: AnalyticsService,
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
    if (!this.activeSessions[client.id]) {
      console.log('creating new session');
      let session = this.createSession(
        client.userLocation,
        client.browser,
        client.device,
        data,
      );
      session = await session.save();
      this.activeSessions[client.id] = session;
    }
    const session = this.activeSessions[client.id];

    const event = new this.eventModel({
      type: data.type,
      subType: data.subType,
      pageLocation: data.pageLocation,
      args: data.args,
      timestamp: new Date(),
      sessionId: new ObjectId(session.id),
    });

    await event.save();

    if (event.type === EVENT_PAGEVIEW) {
      session.numPageViews = session.numPageViews + 1;
      session.lastPageLocation = data.pageLocation;
    }

    Promise.all([
      this.notifyAboutLiveAnalytics(),
      this.notifyAboutLivePageviewsToday(),
    ]);
  }

  @SubscribeMessage('registerForLiveAnalytics')
  registerUserForLiveAnalyitcs(
    client: Client,
  ): Observable<WsResponse<Partial<AnalyticsSession>[]>> {
    console.log('subscribed');
    var subject = new BehaviorSubject<WsResponse<Partial<AnalyticsSession[]>>>({
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

  private createSession(
    location: string,
    browser: any,
    device: any,
    data: AnalyticsEventDto,
  ) {
    const isOnMobile =
      device && (device.type === 'mobile' || device.type === 'tablet');

    const session = new this.sessionModel({
      duration: undefined,
      userLocation: location || data.userLocation,
      numPageViews: 0,
      lastPageLocation: undefined,
      browser: browser ? browser.name : undefined,
      browserVersion: browser ? browser.version : undefined,
      isOnMobile,
    });
    return session;
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
