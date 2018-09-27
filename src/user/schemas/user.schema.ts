import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  email: { type: String, index: { unique: true, background: true } },
  password: String,
  isEmailVerified: { type: Boolean, default: false },
  roles: { type: [String], default: 'user' },
});

UserSchema.virtual('id').get(function() {
  return this._id.toString();
});
