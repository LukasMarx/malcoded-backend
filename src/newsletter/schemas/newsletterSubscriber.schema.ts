import { Schema } from 'mongoose';

export const NewsletterSubscriberSchema = new Schema(
  {
    email: {
      type: String,
      index: { unique: true, sparse: true, background: true },
    },
    isEmailVerified: { type: Boolean, default: false },
    emailHash: { type: String, index: { unique: true, background: true } },
    signUpDate: String,
    signUpIP: String,
    verificationDate: String,
    verificationIP: String,
    deleted: { type: Boolean, default: false },
    deletedDate: String,
  },
  {
    id: false,
  },
);
