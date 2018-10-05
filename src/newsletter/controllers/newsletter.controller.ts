import { Controller, Get, Param, Res, Req } from '@nestjs/common';
import { NewsletterService } from '../services/newsletter.service';
import { ConfigService } from './../../common/services/config.service';
import {
  PostValidateEmailRedirectKey,
  PostUnsubscribeEmailRedirectKey,
} from '../constants';

@Controller('newsletter')
export class NewsletterController {
  constructor(
    private newsletterService: NewsletterService,
    private configService: ConfigService,
  ) {}
  @Get(':token')
  async validateEmail(@Param() { token }, @Res() res, @Req() req) {
    const ip =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress;

    await this.newsletterService.verifySubscriberEmailByToken(token, ip);
    res.redirect(this.configService.get(PostValidateEmailRedirectKey));
  }

  @Get('/unsubscribe/:emailHash')
  async unsubscribe(@Param() { emailHash }, @Res() res, @Req() req) {
    await this.newsletterService.unsubscribe(emailHash);
    res.redirect(this.configService.get(PostUnsubscribeEmailRedirectKey));
  }
}
