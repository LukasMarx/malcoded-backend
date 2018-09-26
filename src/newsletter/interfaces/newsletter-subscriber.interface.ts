import { Document } from 'mongoose';

export interface NewsletterSubscriber extends Document {
  email: string;
  userGaveConsent: boolean;
  isEmailVerified: boolean;
}
