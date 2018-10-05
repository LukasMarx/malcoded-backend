import { Schema } from 'mongoose';

export const EmailTemplateSchema = new Schema({
  name: String,
  mjml: String,
  previewBase64: String,
  variables: [String],
});

EmailTemplateSchema.virtual('id').get(function() {
  return this._id.toString();
});
