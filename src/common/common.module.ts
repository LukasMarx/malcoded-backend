import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';
import { GraphqlService } from './services/graphql.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        process.env.NODE_ENV ? `${process.env.NODE_ENV}.env` : null,
      ),
    },
    GraphqlService,
  ],
  exports: [ConfigService, GraphqlService],
})
export class CommonModule {}
