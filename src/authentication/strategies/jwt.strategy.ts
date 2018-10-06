import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import * as PassportJwt from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportJwt.Strategy {
  constructor(private readonly authService: AuthService) {
    super(
      {
        secretOrKey: process.env.AUTHENTICATION_JWT_TOKEN,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      },
      (payload, done) => this.validate(payload, done),
    );
  }

  async validate(payload: JwtPayload, done) {
    const user = await this.authService.validateUser(payload);
    if (!user) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, user);
  }
}
