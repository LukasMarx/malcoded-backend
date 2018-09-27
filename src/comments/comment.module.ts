import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { commentProviders } from './providers/comment.providers';
import { CommentResolver } from './resolvers/comment.resolver';
import { DatabaseModule } from 'database/database.module';
import { CommonModule } from 'common/common.module';

@Module({
  imports: [CommonModule, DatabaseModule],
  providers: [CommentService, ...commentProviders, CommentResolver],
})
export class CommentModule {}
