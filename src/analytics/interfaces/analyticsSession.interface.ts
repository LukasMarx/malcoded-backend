import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface AnalyticsSession extends Document {
  timestamp: Date;
  duration: Number;
  userLocation: string;
  numPageViews: number;
  browser: string;
  browserVersion: string;
  isOnMobile: boolean;
  lastPageLocation: string;
}

export interface AnalyticsEvent extends Document {
  sessionId: ObjectId;
  timestamp: Date;
  type: string;
  subType: string;
  pageLocation: string;
  args?: string[];
}
