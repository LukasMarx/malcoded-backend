import {
  Resolver,
  Query,
  ResolveProperty,
  Parent,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { Roles } from '../../authentication/decorators/roles.decorator';
import { NewsletterService } from '../services/newsletter.service';
import { SubscribeToNewsletterDto } from '../dto/subscribeToNewsletter.dto';
import { GraphqlService } from '../../common/services/graphql.service';
import { GQLReq } from '../../common/decorators/gql-request.decorator';
import { SendNewsletterDto } from '../dto/sendNewsletter.dto';
import * as EmailValidator from 'email-validator';
import { BadRequestException } from '@nestjs/common';

@Resolver('Newsletter')
export class NewsletterResolver {
  constructor(
    private readonly newsletterService: NewsletterService,
    private readonly graphqlService: GraphqlService,
  ) {}

  @Roles('admin')
  @Query('getNewsletterSubscribers')
  async getNewsletterSubscribers(
    @Args('skip') skip: number,
    @Args('limit') limit: number,
  ) {
    const subscriberQueryListResult = await this.newsletterService.findAllSubscribers(
      skip,
      limit,
    );
    return this.graphqlService.convertArrayToConnection(
      subscriberQueryListResult.result,
      subscriberQueryListResult.totalCount,
    );
  }

  @Roles('admin')
  @Query('newsletterSubscriber')
  async newsletterSubscriber(@Args('id') id: string) {
    return await this.newsletterService.findOneSubscriberById(id);
  }

  @Roles('admin')
  @Query('getNewsletterAnalytics')
  async getNewsletterAnalytics(
    @Args('from') from: string,
    @Args('to') to: string,
  ) {
    const analyticsData = await this.newsletterService.getNewsletterAnalytics(
      from,
      to,
    );
    return analyticsData;
  }

  @Mutation()
  async subscribeToNewsletter(
    @Args('subscribeToNewsletterInput')
    subscribeToNewsletterDto: SubscribeToNewsletterDto,
    @GQLReq() req,
  ) {
    const ip =
      req.headers['cf-connecting-ip'] ||
      req.headers['x-forwarded-for'] ||
      req.connection.remoteAddress;
    if (!EmailValidator.validate(subscribeToNewsletterDto.email)) {
      throw new BadRequestException();
    }
    return await this.newsletterService.subscribeToNewsletter(
      subscribeToNewsletterDto,
      ip,
    );
  }

  @Roles('admin')
  @Mutation()
  async resendNewsletterConfirmEmail(
    @Args('email')
    email: string,
    @GQLReq() req,
  ) {
    const subscriber = await this.newsletterService.findOneSubscriberByEmail(
      email,
    );
    if (!subscriber.isEmailVerified) {
      await this.newsletterService.sendNewsletterVerificationEmail(
        subscriber.email,
      );
      return true;
    } else {
      return false;
    }
  }

  @Roles('admin')
  @Mutation()
  async sendNewsletter(
    @Args('sendNewsletterInput') sendNewsletterDto: SendNewsletterDto,
  ) {
    return await this.newsletterService.sendNewsletterEmail(sendNewsletterDto);
  }
}
