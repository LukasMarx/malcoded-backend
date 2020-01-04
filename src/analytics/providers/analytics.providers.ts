import { Connection } from 'mongoose';
import { DbAnalyticsConnectionToken } from '../../constants';
import { AnalyticsDailySessionCountToken } from '../constants';
import { AnalyticsDailySessionCount } from '../../analytics/schemas/analyticsSession.schema';

export const analyticsProviders = [
  {
    provide: AnalyticsDailySessionCountToken,
    useFactory: (connection: Connection) =>
      connection.model('AnalyticsSession', AnalyticsDailySessionCount),
    inject: [DbAnalyticsConnectionToken],
  },
];
