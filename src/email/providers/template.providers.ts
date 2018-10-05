import { Connection } from 'mongoose';

import { EmailTemplateToken } from '../constants';
import { EmailTemplateSchema } from '../schemas/template.schema';
import { DbConnectionToken } from './../../constants';

export const emailTemplateProviders = [
  {
    provide: EmailTemplateToken,
    useFactory: (connection: Connection) =>
      connection.model('EmailTemplate', EmailTemplateSchema),
    inject: [DbConnectionToken],
  },
];
