import { Module } from '@nestjs/common';
import { EmailService } from './services/email.service';
import { CommonModule } from 'common/common.module';
import { MjmlService } from './services/mjml.service';

@Module({
  imports: [CommonModule],
  providers: [EmailService, MjmlService],
  exports: [EmailService, MjmlService],
})
export class EmailModule {}
