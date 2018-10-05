import { Schema } from 'mongoose';

export const CommentSchema = new Schema({
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  creationDate: { type: String, default: () => new Date().toISOString() },
  updateDate: { type: String, default: () => new Date().toISOString() },
});

CommentSchema.virtual('id').get(function() {
  return this._id.toString();
});
