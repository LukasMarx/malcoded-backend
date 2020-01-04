import { Schema } from 'mongoose';

export const AnalyticsDailySessionCount = new Schema({
  day: {
    type: Date,
  },
  pages: { type: Map, of: Number },
  locations: { type: Map, of: Number },
  browsers: { type: Map, of: Number },
  count: { type: Number, default: 0 },
  affiliateClick: { type: Map, of: Number },
  affiliateView: { type: Map, of: Number },
});

AnalyticsDailySessionCount.index(
  { day: -1, type: 1 },
  { unique: false, background: true },
);
