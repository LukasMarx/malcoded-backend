import { Module } from '@nestjs/common';
import { PostService } from './services/post.service';
import { postProviders } from './providers/post.providers';
import { DatabaseModule } from 'database/database.module';
import { PostResolver } from './resolvers/post.resolver';
import { AuthenticationModule } from 'authentication/authentication.module';

@Module({
  imports: [DatabaseModule, AuthenticationModule],

  providers: [PostService, ...postProviders, PostResolver],
})
export class PostModule {}
