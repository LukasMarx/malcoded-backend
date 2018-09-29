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
  recommendations: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
});

PostSchema.virtual('id').get(function() {
  return this._id.toString();
});
