import { Module } from '@nestjs/common';
import { GeoIpController } from './controllers/geoIp.controller';

@Module({
  controllers: [GeoIpController],
})
export class GeoIpModule {}
