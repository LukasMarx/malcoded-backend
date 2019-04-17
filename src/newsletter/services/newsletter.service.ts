import { Injectable, Inject, BadRequestException } from '@nestjs/common';
import { SubscribeToNewsletterDto } from '../dto/subscribeToNewsletter.dto';
import { NewsletterSubscriberToken, NewsletterJwtTokenKey } from '../constants';
import { NewsletterSubscriber } from '../interfaces/newsletter-subscriber.interface';
import { Model } from 'mongoose';
import { ConfigService } from '../../common/services/config.service';
import * as jwt from 'jsonwebtoken';
import { NewsletterEmailVerificationToken } from '../interfaces/email-verification-token.interface';
import { MjmlService } from '../../email/services/mjml.service';
import { EmailService } from '../../email/services/email.service';
import { verifyEmailTemplate } from '../emailTemplates/verfiyEmail';
import { QueryListResult } from '../../common/interfaces/query-list-result.interface';
import * as crypto from 'crypto';
import { SendNewsletterDto } from '../dto/sendNewsletter.dto';
import { ServerBaseUrlKey } from './../../constants';

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
    ip: string,
  ) {
    const emailHash = crypto
      .createHmac('sha256', '1')
      .update(subscribeToNewsletterDto.email)
      .digest('hex');

    const createdSubscriber = Object.assign(subscribeToNewsletterDto, {
      emailHash,
      signUpIP: ip,
      isEmailVerified: false,
      signUpDate: new Date().toISOString(),
    });

    const subscriber = await this.subscriberModel.findOneAndUpdate(
      { email: subscribeToNewsletterDto.email },
      createdSubscriber,
      { upsert: true, setDefaultsOnInsert: true, new: true },
    );

    await this.sendNewsletterVerificationEmail(subscribeToNewsletterDto.email);
    return subscriber;
  }

  async findAllSubscribers(
    skip?: number,
    limit?: number,
  ): Promise<QueryListResult<NewsletterSubscriber>> {
    const allSubscribers = await this.subscriberModel
      .find()
      .skip(skip || 0)
      .limit(limit || 0)
      .exec();
    const numberOfSubscribers = await this.subscriberModel.countDocuments();

    return {
      result: allSubscribers,
      totalCount: numberOfSubscribers,
    };
  }

  private async findAllConfirmedSubscribers(): Promise<NewsletterSubscriber[]> {
    const allSubscribers = await this.subscriberModel
      .find({ isEmailVerified: true, deleted: { $in: [null, false] } })
      .exec();
    return allSubscribers;
  }

  async findOneSubscriberById(id: string): Promise<NewsletterSubscriber> {
    return await this.subscriberModel.findOne({ _id: id }).exec();
  }

  async findOneSubscriberByEmail(email: string): Promise<NewsletterSubscriber> {
    return await this.subscriberModel.findOne({ email: email }).exec();
  }

  public async sendNewsletterVerificationEmail(email: string) {
    try {
      const html = this.mjmlService.compileToHTML(verifyEmailTemplate, {
        verifyEmailLink:
          `${this.configService.get(ServerBaseUrlKey)}/v1/api/newsletter/` +
          jwt.sign(
            { email: email },
            this.configService.get(NewsletterJwtTokenKey),
          ),
      });
      this.emailService.sendEmail({
        from: 'Malcoded <noreply@malcoded.com>',
        to: email,
        html: html,
        subject: 'Confirm your newsletter subscription',
      });
    } catch (err) {
      console.error(err);
    }
  }

  async verifySubscriberEmailByToken(token: string, ip: string) {
    try {
      const decoded = jwt.verify(
        token,
        this.configService.get(NewsletterJwtTokenKey),
      ) as NewsletterEmailVerificationToken;

      const email = decoded.email;

      return await this.subscriberModel
        .findOneAndUpdate(
          { email: email },
          {
            $set: {
              isEmailVerified: true,
              verificationDate: new Date().toISOString(),
              verificationIP: ip,
            },
          },
          { new: true },
        )
        .exec();
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async unsubscribe(emailHash: string) {
    console.log(emailHash);
    await this.subscriberModel.updateOne(
      { emailHash },
      {
        $unset: { email: '' },
        $set: { deleted: true, deletedDate: new Date().toUTCString() },
      },
    );
  }

  async sendNewsletterEmail(sendNewsletterDto: SendNewsletterDto) {
    let replacements = {};
    if (sendNewsletterDto.replacementString) {
      replacements = JSON.parse(sendNewsletterDto.replacementString);
    }

    const subscribers = await this.findAllConfirmedSubscribers();
    subscribers.forEach(sub => {
      const html = this.mjmlService.compileToHTML(
        sendNewsletterDto.mjml,
        Object.assign(replacements, {
          _unsubscribe: `${this.configService.get(
            ServerBaseUrlKey,
          )}/v1/api/newsletter/unsubscribe/${sub.emailHash}`,
        }),
      );

      this.emailService.sendEmail({
        html,
        from: `Lukas Marx \\(malcoded\) <lukas@malcoded.com>`,
        to: sub.email,
        subject: sendNewsletterDto.subject,
      });
    });
  }

  async getNewsletterAnalytics(from: string, to: string) {
    const signUpCountsPromise = this.subscriberModel
      .aggregate([
        { $match: { signUpDate: { $gt: from, $lt: to } } },
        {
          $project: {
            signUpDate: '$signUpDate',
            dayOfSingUp: {
              $add: [
                {
                  $dayOfYear: {
                    $dateFromString: {
                      dateString: '$signUpDate',
                    },
                  },
                },
                {
                  $multiply: [
                    400,
                    {
                      $year: {
                        $dateFromString: {
                          dateString: '$signUpDate',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: '$dayOfSingUp',
            count: { $sum: 1 },
            signUpDate: { $first: '$signUpDate' },
          },
        },
      ])
      .exec();

    const confirmCountsPromise = this.subscriberModel
      .aggregate([
        { $match: { verificationDate: { $gt: from, $lt: to } } },
        {
          $project: {
            verificationDate: 1,
            dayOfConfirm: {
              $add: [
                {
                  $dayOfYear: {
                    $dateFromString: {
                      dateString: '$verificationDate',
                    },
                  },
                },
                {
                  $multiply: [
                    400,
                    {
                      $year: {
                        $dateFromString: {
                          dateString: '$verificationDate',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: '$dayOfConfirm',
            count: { $sum: 1 },
            verificationDate: { $first: '$verificationDate' },
          },
        },
      ])
      .exec();

    const deleteCountsPromise = this.subscriberModel
      .aggregate([
        { $match: { verificationDate: { $gt: from, $lt: to }, deleted: true } },
        {
          $project: {
            deletedDate: 1,
            dayOfDelete: {
              $add: [
                {
                  $dayOfYear: {
                    $dateFromString: {
                      dateString: '$deletedDate',
                    },
                  },
                },
                {
                  $multiply: [
                    400,
                    {
                      $year: {
                        $dateFromString: {
                          dateString: '$deletedDate',
                        },
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
        {
          $group: {
            _id: '$dayOfDelete',
            count: { $sum: 1 },
            deletedDate: { $first: '$deletedDate' },
          },
        },
      ])
      .exec();

    const [singups, confirmations, unsubscribes] = await Promise.all([
      signUpCountsPromise,
      confirmCountsPromise,
      deleteCountsPromise,
    ]);

    const startDate = new Date(from);
    const endDate = new Date(to);
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const analyticsData = {
      signups: [],
      confirmations: [],
      unsubscribes: [],
    };

    var signupMap = singups.reduce(function(map, obj) {
      map[new Date(obj.signUpDate.split('T')[0]).toISOString()] = obj.count;
      return map;
    }, {});

    var confirmMap = confirmations.reduce(function(map, obj) {
      map[new Date(obj.verificationDate.split('T')[0]).toISOString()] =
        obj.count;
      return map;
    }, {});

    var unsubscribesMap = unsubscribes.reduce(function(map, obj) {
      map[new Date(obj.deletedDate.split('T')[0]).toISOString()] = obj.count;
      return map;
    }, {});

    for (let i = 0; i < diffDays; i++) {
      const date = this.addDays(startDate, i);
      const key = new Date(date.toISOString().split('T')[0]).toISOString();
      analyticsData.signups.push({
        key,
        count: signupMap[key] || 0,
      });
      analyticsData.confirmations.push({
        key,
        count: confirmMap[key] || 0,
      });
      analyticsData.unsubscribes.push({
        key,
        count: unsubscribesMap[key] || 0,
      });
    }

    return analyticsData;
  }

  addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
}
