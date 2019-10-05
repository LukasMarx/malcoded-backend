import { Roles } from './../../authentication/decorators/roles.decorator';

import { Args, Resolver, Query } from '@nestjs/graphql';

import { AnalyticsService } from './../../analytics/services/analytics.service';

@Resolver('Analytics')
export class AnalyticsResolver {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Roles('admin')
  @Query('getPageviewAnalytics')
  async getPageviewAnalytics(
    @Args('from') from: string,
    @Args('to') to: string,
  ) {
    const analyticsData = await this.analyticsService.getPageviewAnalytics(
      from,
      to,
    );
    return analyticsData;
  }

  @Roles('admin')
  @Query('getBrowserStatistics')
  async getBrowserStatistics(
    @Args('from') from: string,
    @Args('to') to: string,
  ) {
    const analyticsData = await this.analyticsService.getBrowserStatistics(
      from,
      to,
    );
    return analyticsData;
  }
}
