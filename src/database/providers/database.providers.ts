import * as mongoose from 'mongoose';
import { DbConnectionToken, DbAnalyticsConnectionToken } from '../../constants';

export const databaseProviders = [
  {
    provide: DbConnectionToken,
    useFactory: async () => {
      return mongoose.createConnection(process.env.MONGODB_URL, {
        dbName: process.env.MONGODB_DBNAME,
      });
    },
  },
  {
    provide: DbAnalyticsConnectionToken,
    useFactory: async () => {
      return mongoose.createConnection(process.env.MONGODB_URL, {
        dbName: process.env.MONGODB_ANALYTICS_DBNAME,
      });
    },
  },
];
