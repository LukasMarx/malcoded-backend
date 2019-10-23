import { Schema } from 'mongoose';

export const AnalyticsEventSchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sessionId: {
    type: Schema.Types.ObjectId,
    index: { unique: false, background: true },
  },
  type: {
    type: String,
    index: { unique: false, background: true },
  },
  subType: String,
  pageLocation: String,
  args: [String],
});

AnalyticsEventSchema.index(
  { timestamp: -1, type: 1 },
  { unique: false, background: true },
);

AnalyticsEventSchema.index(
  { timestamp: -1 },
  { unique: false, background: true },
);

export const AnalyticsSessionSchema = new Schema({
  timestamp: {
    type: Date,
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

AnalyticsSessionSchema.index(
  { timestamp: -1 },
  { unique: false, background: true },
);

AnalyticsEventSchema.virtual('id').get(function() {
  return this._id.toString();
});
