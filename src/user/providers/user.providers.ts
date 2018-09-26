import { Connection } from 'mongoose';
import { DbConnectionToken } from '../../constants';
import { UserModelToken } from '../constants';
import { UserSchema } from '../schemas/user.schema';

export const userProviders = [
  {
    provide: UserModelToken,
    useFactory: (connection: Connection) =>
      connection.model('User', UserSchema),
    inject: [DbConnectionToken],
  },
];
