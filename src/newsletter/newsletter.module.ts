import { Module } from '@nestjs/common';
import { NewsletterService } from './services/newsletter.service';
import { newsletterSubscriberProviders } from './providers/newsletter-subscriber.providers';
import { DatabaseModule } from '../database/database.module';
import { NewsletterResolver } from './resolvers/newsletter.resolver';
import { NewsletterController } from './controllers/newsletter.controller';
import { CommonModule } from '../common/common.module';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [DatabaseModule, CommonModule, EmailModule],
  providers: [
    NewsletterService,
    ...newsletterSubscriberProviders,
    NewsletterResolver,
  ],
  controllers: [NewsletterController],
})
export class NewsletterModule {}
