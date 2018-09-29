import * as mongoose from 'mongoose';
import { DbConnectionToken, GridFsConnectionToken } from '../../constants';
import { Connection } from 'mongoose';
import * as Grid from 'gridfs-stream';
import { GridFSBucket } from 'mongodb';

export const databaseProviders = [
  {
    provide: DbConnectionToken,
    useFactory: async (): Promise<typeof mongoose> => {
      return mongoose.connect('mongodb://localhost/nest');
    },
  },
];
