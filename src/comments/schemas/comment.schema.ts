import { Schema } from 'mongoose';

export const CommentSchema = new Schema({
  content: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  post: { type: Schema.Types.ObjectId, ref: 'Post' },
  creationDate: { type: Schema.Types.Date },
  updateDate: { type: Schema.Types.Date },
});

CommentSchema.virtual('id').get(function() {
  return this._id.toString();
});
