import { Injectable, Inject } from '@nestjs/common';
import { Model } from 'mongoose';
import {
  AnalyticsEvent,
  AnalyticsSession,
} from './../../analytics/interfaces/analyticsSession.interface';
import {
  AnalyticsEventToken,
  AnalyticsSessionToken,
} from './../../analytics/constants';

@Injectable()
export class AnalyticsService {
  constructor(
    @Inject(AnalyticsEventToken)
    private readonly analytisEventModel: Model<AnalyticsEvent>,
    @Inject(AnalyticsSessionToken)
    private readonly analytisSessionModel: Model<AnalyticsSession>,
  ) {}

  async getPageviewAnalytics(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const diffTime = Math.abs(toDate.getTime() - fromDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const pageviewsPerDayPromise = this.getPageviewsInPeriod(fromDate, toDate);
    const sessionsPerDayPromise = this.getSessionsInPeriod(fromDate, toDate);
    const prePageviewsPerDayPromise = this.getPageviewsInPeriod(
      this.addDays(fromDate, diffDays * -1),
      this.addDays(toDate, diffDays * -1),
    );
    const preSessionsPerDayPromise = this.getSessionsInPeriod(
      this.addDays(fromDate, diffDays * -1),
      this.addDays(toDate, diffDays * -1),
    );

    const [
      pageviewsPerDay,
      sessionsPerDay,
      prePageviewsPerDay,
      preSessionsPerDay,
    ] = await Promise.all([
      pageviewsPerDayPromise,
      sessionsPerDayPromise,
      prePageviewsPerDayPromise,
      preSessionsPerDayPromise,
    ]);

    var pageviewsPerDayMap = pageviewsPerDay.reduce(function(map, obj) {
      map[new Date(obj.timestamp.toISOString().split('T')[0]).toISOString()] =
        obj.count;
      return map;
    }, {});

    var sessionsPerDayMap = sessionsPerDay.reduce(function(map, obj) {
      map[new Date(obj.timestamp.toISOString().split('T')[0]).toISOString()] =
        obj.count;
      return map;
    }, {});

    var prePageviewsPerDaypMap = prePageviewsPerDay.reduce(function(map, obj) {
      map[new Date(obj.timestamp.toISOString().split('T')[0]).toISOString()] =
        obj.count;
      return map;
    }, {});

    var preSessionsPerDayMap = preSessionsPerDay.reduce(function(map, obj) {
      map[new Date(obj.timestamp.toISOString().split('T')[0]).toISOString()] =
        obj.count;
      return map;
    }, {});

    const analyticsData = {
      sessions: [],
      sessionsPreviousPeriod: [],
      pageviews: [],
      pageviewsPreviousPeriod: [],
    };

    for (let i = 0; i < diffDays; i++) {
      const date = this.addDays(fromDate, i);
      const key = new Date(date.toISOString().split('T')[0]).toISOString();
      analyticsData.sessions.push({
        key,
        count: sessionsPerDayMap[key] || 0,
      });

      analyticsData.pageviews.push({
        key,
        count: pageviewsPerDayMap[key] || 0,
      });
    }
    for (let i = 0; i < diffDays; i++) {
      const date = this.addDays(this.addDays(fromDate, diffDays * -1), i);
      const key = new Date(date.toISOString().split('T')[0]).toISOString();
      analyticsData.sessionsPreviousPeriod.push({
        key,
        count: preSessionsPerDayMap[key] || 0,
      });

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
    return this.analytisEventModel
      .countDocuments({
        timestamp: { $gt: today, $lt: tomorrow },
        type: 'pageview',
      })
      .exec();
  }

  async getBrowserStatistics(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);
    const browsers: any[] = await this.analytisSessionModel
      .aggregate([
        {
          $match: {
            timestamp: { $gt: fromDate, $lt: toDate },
          },
        },
        {
          $group: {
            _id: '$browser',
            count: { $sum: 1 },
          },
        },
      ])
      .exec();

    const result = browsers.map(browser => {
      return {
        key: browser._id || 'N/S',
        count: browser.count,
      };
    });

    return {
      from: from,
      to: to,
      statistics: result,
    };
  }

  async getAffiliateStatistics(from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    const affiliateViews = await this.getEventsInPeriod(
      fromDate,
      toDate,
      'affiliateView',
      'subType',
    );
    const affiliateClicks = await this.getEventsInPeriod(
      fromDate,
      toDate,
      'affiliateClick',
      'subType',
    );

    const clickMap = {};
    affiliateClicks.forEach(click => {
      clickMap[click._id] = click;
    });

    const result = [];

    for (let affiliate of affiliateViews) {
      if (affiliate._id) {
        result.push({
          affiliate: affiliate._id,
          views: affiliate.count,
          clicks: clickMap[affiliate._id].count,
        });
      }
    }

    return {
      from,
      to,
      statistics: result,
    };
  }

  private async getPageviewsInPeriod(from: Date, to: Date) {
    return this.analytisEventModel
      .aggregate([
        {
          $match: {
            timestamp: { $gt: from, $lt: to },
            type: 'pageview',
          },
        },
        {
          $project: {
            timestamp: '$timestamp',
            dayOfEvent: {
              $add: [
                {
                  $dayOfYear: '$timestamp',
                },
                {
                  $multiply: [
                    400,
                    {
                      $year: '$timestamp',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: '$dayOfEvent',
            count: { $sum: 1 },
            timestamp: { $first: '$timestamp' },
          },
        },
      ])
      .exec();
  }

  private async getEventsInPeriod(
    from: Date,
    to: Date,
    type: string,
    groupBy?: string,
  ) {
    const query: any[] = [
      {
        $match: {
          timestamp: { $gt: from, $lt: to },
          type: type,
        },
      },
    ];

    if (groupBy) {
      query.push({
        $group: {
          _id: `$${groupBy}`,
          count: { $sum: 1 },
        },
      });
    }

    return this.analytisEventModel.aggregate(query).exec();
  }

  private async getSessionsInPeriod(from: Date, to: Date) {
    return this.analytisSessionModel
      .aggregate([
        {
          $match: {
            timestamp: { $gt: from, $lt: to },
          },
        },
        {
          $project: {
            timestamp: '$timestamp',
            dayOfEvent: {
              $add: [
                {
                  $dayOfYear: '$timestamp',
                },
                {
                  $multiply: [
                    400,
                    {
                      $year: '$timestamp',
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: '$dayOfEvent',
            count: { $sum: 1 },
            timestamp: { $first: '$timestamp' },
          },
        },
      ])
      .exec();
  }

  private addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
