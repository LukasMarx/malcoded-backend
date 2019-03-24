import { User } from 'user/interfaces/user.interface';

import { Document } from 'mongoose';

export interface Comment extends Document {
  author: User;
  content: string;
  post: string;
  isAnswer: Boolean;
  answers: Comment[];
}
