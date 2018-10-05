import { Schema } from 'mongoose';

export const PostSchema = new Schema({
  title: String,
  description: String,
  url: String,
  thumbnail: String,
  primaryColor: String,
  content: String,
  releaseDate: String,
  category: String,
  isPublic: Boolean,
  recommendedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  author: { type: Schema.Types.ObjectId, ref: 'User' },
});

PostSchema.virtual('id').get(function() {
  return this._id.toString();
});
