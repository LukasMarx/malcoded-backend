import { Schema } from 'mongoose';

export const UserSchema = new Schema(
  {
    email: { type: String, index: { unique: true, background: true } },
    password: String,
    emailConfirmed: { type: Boolean, default: false },
    roles: [String],
  },
  {
    id: false,
  },
);
