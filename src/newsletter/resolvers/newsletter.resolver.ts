import {
  Resolver,
  Query,
  ResolveProperty,
  Parent,
  Args,
  Mutation,
} from '@nestjs/graphql';
import { Roles } from 'authentication/decorators/roles.decorator';
import { NewsletterService } from '../services/newsletter.service';
import { SubscribeToNewsletterDto } from '../dto/subscribeToNewsletter.dto';
import { GraphqlService } from 'common/services/graphql.service';

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
  @Query('newsletterSubscribers')
  async newsletterSubscribers(@Args('id') id: string) {
    return await this.newsletterService.findOneSubscriberById(id);
  }

  @Mutation()
  async subscribeToNewsletter(
    @Args('subscribeToNewsletterInput')
    subscribeToNewsletterDto: SubscribeToNewsletterDto,
  ) {
    return await this.newsletterService.subscribeToNewsletter(
      subscribeToNewsletterDto,
    );
  }
}
