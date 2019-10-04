import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { CommonModule } from '../common/common.module';
import { analyticsProviders } from './providers/analytics.providers';
import { PageviewGateway } from './gateways/pageview.gateway';
import { AnalyticsService } from './services/analytics.service';
import { AnalyticsResolver } from './resolvers/analytics.resolver';

@Module({
  imports: [CommonModule, DatabaseModule],
  providers: [
    ...analyticsProviders,
    PageviewGateway,
    AnalyticsService,
    AnalyticsResolver,
  ],
  exports: [PageviewGateway],
})
export class AnalyticsModule {}
