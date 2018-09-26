import { Connection } from 'mongoose';
import { PostSchema } from '../schemas/post.schema';
import { PostModelToken } from '../constants';
import { DbConnectionToken } from '../../constants';

export const postProviders = [
  {
    provide: PostModelToken,
    useFactory: (connection: Connection) =>
      connection.model('Post', PostSchema),
    inject: [DbConnectionToken],
  },
];
