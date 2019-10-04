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

export const EVENT_PAGEVIEW = 'pageview';

@WebSocketGateway({
  path: '/v1/api/ws',
  // transports: ['websocket'],
})
export class PageviewGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private activeSessions: { [key: string]: Partial<AnalyticsSession> } = {};

  private liveAnalyticsSubscribers: {
    [key: string]: Subject<WsResponse<Partial<AnalyticsSession>[]>>;
  } = {};

  constructor(
    @Inject(AnalyticsSessionToken)
    private readonly sessionModel: Model<AnalyticsSession>,
    @Inject(AnalyticsEventToken)
    private readonly eventModel: Model<AnalyticsEvent>,
  ) {}

  handleConnection(client: Client, ...args: any[]) {
    console.log('connected');
  }

  async handleDisconnect(client: Client) {
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
    Object.values(this.liveAnalyticsSubscribers).forEach(subject => {
      subject.next({
        event: 'updateLiveAnalytics',
        data: Object.values(this.activeSessions),
      });
    });
  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('event')
  async onAnalyticsEvent(client: Client, data: AnalyticsEventDto) {
    if (!this.activeSessions[client.id]) {
      console.log('creating new session');
      let session = this.createSession(data);
      session = await session.save();
      this.activeSessions[client.id] = session;
    }
    const session = this.activeSessions[client.id];

    const event = new this.eventModel({
      type: data.type,
      pageLocation: data.pageLocation,
      args: data.args,
      timestamp: new Date(),
      sessionId: new ObjectId(session.id),
    });

    await event.save();

    if (event.type === EVENT_PAGEVIEW) {
      console.log('event');
      session.numPageViews = session.numPageViews + 1;
      session.lastPageLocation = data.pageLocation;
    }

    Object.values(this.liveAnalyticsSubscribers).forEach(subject => {
      subject.next({
        event: 'updateLiveAnalytics',
        data: Object.values(this.activeSessions),
      });
    });
  }

  @Roles('admin')
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

  private createSession(data: AnalyticsEventDto) {
    const session = new this.sessionModel({
      duration: undefined,
      userLocation: data.userLocation,
      numPageViews: 0,
      lastPageLocation: undefined,
    });
    return session;
  }
}
