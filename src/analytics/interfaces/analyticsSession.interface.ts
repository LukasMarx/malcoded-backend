import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

export interface AnalyticsDailySessionCount extends Document {
  day: Date;
  pages: { [key: string]: number };
  count: number;
  locations: { [key: string]: number };
  browsers: Map<string, number>;
  affiliateClick: Map<string, number>;
  affiliateView: Map<string, number>;
}
