import { Module, forwardRef } from '@nestjs/common';
import { DatabaseModule } from 'database/database.module';
import { UserService } from './services/user.service';
import { userProviders } from './providers/user.providers';
import { UserResolver } from './resolvers/user.resolver';
import { CryptoModule } from 'crypto/crypto.module';
import { AuthenticationModule } from 'authentication/authentication.module';

@Module({
  imports: [
    DatabaseModule,
    CryptoModule,
    forwardRef(() => AuthenticationModule),
  ],

  providers: [UserService, ...userProviders, UserResolver],
  exports: [UserService],
})
export class UserModule {}
