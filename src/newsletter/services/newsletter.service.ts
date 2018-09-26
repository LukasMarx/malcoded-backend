import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SubscribeToNewsletterDto } from '../dto/subscribeToNewsletter.dto';
import { NewsletterSubscriberToken, NewsletterJwtTokenKey } from '../constants';
import { NewsletterSubscriber } from '../interfaces/newsletter-subscriber.interface';
import { Model } from 'mongoose';
import { ConfigService } from 'common/services/config.service';
import * as jwt from 'jsonwebtoken';
import { NewsletterEmailVerificationToken } from '../interfaces/email-verification-token.interface';
import { MjmlService } from 'email/services/mjml.service';
import { EmailService } from 'email/services/email.service';
import { verifyEmailTemplate } from '../emailTemplates/verfiyEmail';

@Injectable()
export class NewsletterService {
  constructor(
    @Inject(NewsletterSubscriberToken)
    private readonly subscriberModel: Model<NewsletterSubscriber>,
    private configService: ConfigService,
    private mjmlService: MjmlService,
    private emailService: EmailService,
  ) {}

  async subscribeToNewsletter(
    subscribeToNewsletterDto: SubscribeToNewsletterDto,
  ) {
    const createdSubscriber = new this.subscriberModel(
      subscribeToNewsletterDto,
    );
    const subscriber = await createdSubscriber.save();

    await this.sendNewsletterVerificationEmail(subscribeToNewsletterDto.email);
    return subscriber;
  }

  async findAllSubscribers(): Promise<NewsletterSubscriber[]> {
    return await this.subscriberModel.find().exec();
  }

  async findOneSubscriberById(id: string): Promise<NewsletterSubscriber> {
    return await this.subscriberModel.findOne({ _id: id }).exec();
  }

  async findOneSubscriberByEmail(email: string): Promise<NewsletterSubscriber> {
    return await this.subscriberModel.findOne({ email: email }).exec();
  }

  private async sendNewsletterVerificationEmail(email: string) {
    const html = this.mjmlService.compileToHTML(verifyEmailTemplate, {
      verifyEmailLink:
        'http://localhost:3000/newsletter/' +
        jwt.sign(
          { email: email },
          this.configService.get(NewsletterJwtTokenKey),
        ),
    });
    this.emailService.sendEmail({
      from: this.configService.get('NOREPLY_ADDRESS'),
      to: email,
      html: html,
      subject: 'Please confirm!',
    });
  }

  async verifySubscriberEmailByToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        this.configService.get(NewsletterJwtTokenKey),
      ) as NewsletterEmailVerificationToken;

      const email = decoded.email;

      return await this.subscriberModel
        .findOneAndUpdate(
          { email: email },
          { $set: { isEmailVerified: true } },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException();
    }
  }
}
