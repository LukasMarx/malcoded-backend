import { Connection } from 'mongoose';
import { DbConnectionToken } from '../../constants';
import { CommentModelToken } from '../constants';
import { CommentSchema } from '../schemas/comment.schema';

export const commentProviders = [
  {
    provide: CommentModelToken,
    useFactory: (connection: Connection) =>
      connection.model('Comment', CommentSchema),
    inject: [DbConnectionToken],
  },
];
