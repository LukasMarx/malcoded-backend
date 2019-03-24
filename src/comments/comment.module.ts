import { Module, forwardRef } from '@nestjs/common';
import { CommentService } from './services/comment.service';
import { commentProviders } from './providers/comment.providers';
import { CommentResolver } from './resolvers/comment.resolver';
import { DatabaseModule } from '../database/database.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [CommonModule, DatabaseModule, UserModule],
  providers: [CommentService, ...commentProviders, CommentResolver],
  exports: [CommentService],
})
export class CommentModule {}
