import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  email: { type: String },
  password: String,
  isEmailVerified: { type: Boolean, default: false },
  roles: { type: [String], default: 'user' },
  displayName: String,
  providerId: String,
  provider: String,
  image: Buffer,
});

UserSchema.virtual('id').get(function() {
  return this._id.toString();
});

UserSchema.index({ email: 1, provider: 1 }, { unique: true });
