import { Document } from 'mongoose';

export interface Post extends Document {
  readonly _id: string;
  readonly title: string;
  readonly description: string;
  readonly releaseDate: Date;
  readonly thumbnail: string;
  readonly url: string;
  readonly primaryColor: string;
}
