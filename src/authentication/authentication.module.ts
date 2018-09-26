import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './resolvers/authentication.resolver';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    forwardRef(() => UserModule),
    JwtModule.register({
      secretOrPrivateKey: '123',
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    AuthResolver,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AuthenticationModule {}
