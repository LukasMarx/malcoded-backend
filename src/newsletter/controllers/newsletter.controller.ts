import { Controller, Get, Param } from '@nestjs/common';
import { NewsletterService } from '../services/newsletter.service';

@Controller('newsletter')
export class NewsletterController {
  constructor(private newsletterService: NewsletterService) {}
  @Get(':token')
  async validateEmail(@Param() { token }) {
    return await this.newsletterService.verifySubscriberEmailByToken(token);
  }
}
