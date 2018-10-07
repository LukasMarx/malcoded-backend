import { Module, forwardRef } from '@nestjs/common';
import { PostService } from './services/post.service';
import { postProviders } from './providers/post.providers';
import { DatabaseModule } from '../database/database.module';
import { PostResolver } from './resolvers/post.resolver';
import { AuthenticationModule } from '../authentication/authentication.module';
import { CommonModule } from '../common/common.module';
import { UserModule } from '../user/user.module';
import { CommentModule } from '../comments/comment.module';

@Module({
  imports: [
    CommonModule,
    DatabaseModule,
    AuthenticationModule,
    UserModule,
    forwardRef(() => CommentModule),
  ],

  providers: [PostService, ...postProviders, PostResolver],
  exports: [PostService],
})
export class PostModule {}
