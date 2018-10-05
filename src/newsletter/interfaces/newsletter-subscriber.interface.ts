import { Document } from 'mongoose';

export interface NewsletterSubscriber extends Document {
  email: string;
  isEmailVerified: boolean;
  emailHash: string;
  signUpDate: string;
  signUpIP: string;
  verificationDate: string;
  verificationIP: string;
}
