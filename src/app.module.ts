import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { GraphQLModule } from '@nestjs/graphql';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthenticationModule } from './authentication/authentication.module';
import { NewsletterModule } from './newsletter/newsletter.module';
import { EmailModule } from 'email/email.module';

@Module({
  imports: [
    PostModule,
    GraphQLModule.forRoot({
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
    }),
    CommonModule,
    UserModule,
    AuthenticationModule,
    NewsletterModule,
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
