import { Connection } from 'mongoose';
import { DbAnalyticsConnectionToken } from '../../constants';
import { AnalyticsSessionToken, AnalyticsEventToken } from '../constants';
import {
  AnalyticsSessionSchema,
  AnalyticsEventSchema,
} from '../schemas/analyticsSession.schema';

export const analyticsProviders = [
  {
    provide: AnalyticsSessionToken,
    useFactory: (connection: Connection) =>
      connection.model('AnalyticsSession', AnalyticsSessionSchema),
    inject: [DbAnalyticsConnectionToken],
  },
  {
    provide: AnalyticsEventToken,
    useFactory: (connection: Connection) =>
      connection.model('AnalyticsEvent', AnalyticsEventSchema),
    inject: [DbAnalyticsConnectionToken],
  },
];
