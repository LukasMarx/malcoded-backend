import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface AnalyticsSession extends Document {
  timestamp: Date;
  duration: Number;
  userLocation: string;
  numPageViews: number;
  browserType: string;
  userAgent: string;
  isOnMobile: boolean;
  lastPageLocation: string;
}

export interface AnalyticsEvent extends Document {
  sessionId: ObjectId;
  timestamp: Date;
  type: string;
  pageLocation: string;
  args?: string[];
}