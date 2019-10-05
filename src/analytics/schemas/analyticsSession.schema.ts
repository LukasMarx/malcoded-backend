import { Schema } from 'mongoose';

export const AnalyticsEventSchema = new Schema({
  timestamp: {
    type: Date,
    index: { unique: false, background: true },
    default: Date.now,
  },
  sessionId: {
    type: Schema.Types.ObjectId,
    index: { unique: false, background: true },
  },
  type: String,
  pageLocation: String,
  args: [String],
});

export const AnalyticsSessionSchema = new Schema({
  timestamp: {
    type: Date,
    index: { unique: false, background: true },
    default: Date.now,
  },
  duration: Number,
  userLocation: String,
  numPageViews: Number,
  browser: String,
  browserVersion: String,
  isOnMobile: Boolean,
  lastPageLocation: String,
});

AnalyticsSessionSchema.virtual('id').get(function() {
  return this._id.toString();
});

AnalyticsEventSchema.virtual('id').get(function() {
  return this._id.toString();
});
