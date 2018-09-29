import { Module } from '@nestjs/common';
import { AssetService } from './services/asset.service';
import { AssetController } from './controllers/asset.controller';
import { DatabaseModule } from 'database/database.module';
import { AssetResolver } from './resolvers/asset.resolver';
import { CommonModule } from 'common/common.module';
import { ImageService } from './services/image.service';


@Module({
  imports: [DatabaseModule, CommonModule],
  providers: [AssetService, AssetResolver, ImageService],
  controllers: [AssetController],
})
export class AssetModule {}
