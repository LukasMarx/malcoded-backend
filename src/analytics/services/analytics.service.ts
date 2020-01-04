import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import { AnalyticsDailySessionCountToken } from './../../analytics/constants';
import { AnalyticsDailySessionCount } from 'analytics/interfaces/analyticsSession.interface';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(AnalyticsDailySessionCountToken)
    private readonly dailySessionModel: Model<AnalyticsDailySessionCount>,
  ) {}

  async getPageviewAnalytics(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const pageviewsPerDayPromise = this.getPageviewsInPeriod(fromDate, toDate);

    const prePageviewsPerDayPromise = this.getPageviewsInPeriod(
      this.addDays(fromDate, diffDays * -1),
      this.addDays(toDate, diffDays * -1),
    );

    const [pageviewsPerDay, prePageviewsPerDay] = await Promise.all([
      pageviewsPerDayPromise,
      prePageviewsPerDayPromise,
    ]);

    var pageviewsPerDayMap = pageviewsPerDay.reduce(function(map, obj) {
      map[obj.day.toISOString()] = obj.count || 0;
      return map;
    }, {});

    var prePageviewsPerDaypMap = prePageviewsPerDay.reduce(function(map, obj) {
      map[obj.day.toISOString()] = obj.count || 0;
      return map;
    }, {});

    const analyticsData = {
      pageviews: [],
      pageviewsPreviousPeriod: [],
    };

    for (let i = 0; i < diffDays; i++) {
      const date = this.addDays(fromDate, i);
      const key = new Date(date.toISOString().split('T')[0]).toISOString();

      analyticsData.pageviews.push({
        key,
        count: pageviewsPerDayMap[key] || 0,
      });
    }
    for (let i = 0; i < diffDays; i++) {
      const date = this.addDays(this.addDays(fromDate, diffDays * -1), i);
      const key = new Date(date.toISOString().split('T')[0]).toISOString();

      analyticsData.pageviewsPreviousPeriod.push({
        key,
        count: prePageviewsPerDaypMap[key] || 0,
      });
    }

    return analyticsData;
  }

  async getPageviewsToday() {
    const today = new Date(new Date().toISOString().split('T')[0]);
    const tomorrow = this.addDays(today, 1);
    var model = await this.dailySessionModel.findOne({ day: today });
    return model ? model.count : 0;
  }

  async getBrowserStatistics(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const days = await this.dailySessionModel.find({
      day: { $gt: fromDate, $lt: toDate },
    });

    const browserMap = {};
    const browserArray = [];

    days.forEach(day => {
      if (day.browsers) {
        day.browsers.forEach((value, key) => {
          if (browserMap[key]) {
            browserMap[key] += value;
          } else {
            browserMap[key] = value;
          }
        });
      }
    });

    for (const key in browserMap) {
      browserArray.push({
        key,
        count: browserMap[key] || 0,
      });
    }

    return {
      from: from,
      to: to,
      statistics: browserArray,
    };
  }

  async getAffiliateStatistics(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const days = await this.dailySessionModel.find({
      day: { $gt: fromDate, $lt: toDate },
    });

    const affiliateClickMap = {};
    const affiliateViewMap = {};

    days.forEach(day => {
      if (day.affiliateClick) {
        day.affiliateClick.forEach((value, key) => {
          if (affiliateClickMap[key]) {
            affiliateClickMap[key] += value || 0;
          } else {
            affiliateClickMap[key] = value || 0;
          }
        });
      }
      if (day.affiliateView) {
        day.affiliateView.forEach((value, key) => {
          if (affiliateViewMap[key]) {
            affiliateViewMap[key] += value || 0;
          } else {
            affiliateViewMap[key] = value || 0;
          }
        });
      }
    });

    const result = [];

    for (let affiliate in affiliateViewMap) {
      result.push({
        affiliate: affiliate,
        views: affiliateViewMap[affiliate] || 0,
        clicks: affiliateClickMap[affiliate] || 0,
      });
    }

    return {
      from,
      to,
      statistics: result,
    };
  }

  private async getPageviewsInPeriod(from: Date, to: Date) {
    const days = await this.dailySessionModel.find({
      day: { $gt: from, $lt: to },
    });
    return days;
  }

  private addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
