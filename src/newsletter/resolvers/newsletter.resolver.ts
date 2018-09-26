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

@Resolver('Newsletter')
export class NewsletterResolver {
  constructor(private readonly newsletterService: NewsletterService) {}

  @Roles('admin')
  @Query('getNewsletterSubscribers')
  async getNewsletterSubscribers() {
    return await this.newsletterService.findAllSubscribers();
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
