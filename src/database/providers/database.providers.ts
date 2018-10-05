import * as mongoose from 'mongoose';
import { DbConnectionToken } from '../../constants';

export const databaseProviders = [
  {
    provide: DbConnectionToken,
    useFactory: async (): Promise<typeof mongoose> => {
      return mongoose.connect(
        process.env.MONGODB_URL,
        { dbName: process.env.MONGODB_DBNAME },
      );
    },
  },
];
