import { User } from 'user/interfaces/user.interface';
import { Post } from 'post/interfaces/post.interface';
import { Document } from 'mongoose';

export interface Comment extends Document {
  author: User;
  content: string;
  post: Post;
}
