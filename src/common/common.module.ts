import { Module } from '@nestjs/common';
import { ConfigService } from './services/config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(
        process.env.NODE_ENV ? `${process.env.NODE_ENV}.env` : null,
      ),
    },
  ],
  exports: [ConfigService],
})
export class CommonModule {}
