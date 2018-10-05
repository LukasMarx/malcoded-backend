import { Module, forwardRef, HttpModule } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './resolvers/authentication.resolver';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guards/roles.guard';
import { AuthenticationController } from './controllers/authentication.controller';
import { GoogleStrategy } from './strategies/google.strategy';

@Module({
  imports: [
    HttpModule,
    forwardRef(() => UserModule),
    JwtModule.register({
      secretOrPrivateKey: process.env.AUTHENTICATION_JWT_TOKEN,
      signOptions: {
        expiresIn: 3600,
      },
    }),
  ],
  providers: [
    AuthService,
    JwtStrategy,
    GoogleStrategy,
    AuthResolver,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
