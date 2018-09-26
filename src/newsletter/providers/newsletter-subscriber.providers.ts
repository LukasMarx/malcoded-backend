import { Connection } from 'mongoose';
import { DbConnectionToken } from '../../constants';
import { NewsletterSubscriberToken } from '../constants';
import { NewsletterSubscriberSchema } from '../schemas/newsletterSubscriber.schema';

export const newsletterSubscriberProviders = [
  {
    provide: NewsletterSubscriberToken,
    useFactory: (connection: Connection) =>
      connection.model('NewsletterSubscriber', NewsletterSubscriberSchema),
    inject: [DbConnectionToken],
  },
];
