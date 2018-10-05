import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { CommonModule } from '../common/common.module';
import { MjmlService } from './services/mjml.service';
import { MjmlController } from './controllers/mjml.controller';
import { TemplateService } from './services/template.service';
import { emailTemplateProviders } from './providers/template.providers';
import { EmailTemplateResolver } from './resolvers/template.resolver';
import { DatabaseModule } from './../database/database.module';

@Module({
  imports: [CommonModule, DatabaseModule],
  providers: [
    ...emailTemplateProviders,
    EmailService,
    MjmlService,
    TemplateService,
    EmailTemplateResolver,
  ],
  exports: [EmailService, MjmlService],
  controllers: [MjmlController],
})
export class EmailModule {}
