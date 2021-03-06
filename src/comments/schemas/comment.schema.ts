import { Schema } from 'mongoose';

export const CommentSchema = new Schema({
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  creationDate: { type: String, default: () => new Date().toISOString() },
  updateDate: { type: String, default: () => new Date().toISOString() },
  isAnswer: { type: Boolean, default: false },
  answers: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  deleted: { type: Boolean, default: false },
});

CommentSchema.virtual('id').get(function() {
  return this._id.toString();
});
