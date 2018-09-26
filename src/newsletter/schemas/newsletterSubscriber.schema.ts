import { Schema } from 'mongoose';

export const NewsletterSubscriberSchema = new Schema(
  {
    email: { type: String, index: { unique: true, background: true } },
    userGaveConsent: Boolean,
    isEmailVerified: { type: Boolean, default: false },
  },
  {
    id: false,
  },
);
