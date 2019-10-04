import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { EmailModule } from './email/email.module';
import { CommentModule } from './comments/comment.module';
import { GeoIpModule } from './geoIp/geoip.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { PageviewGateway } from 'analytics/gateways/pageview.gateway';
@Module({
  imports: [
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      path: '/v1/api/graphql',
      context: ({ req }) => ({ req }),
    }),
    CommonModule,
    UserModule,
    AuthenticationModule,
    NewsletterModule,
    EmailModule,
    CommentModule,
    GeoIpModule,
    AnalyticsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
