import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import * as passport from 'passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { GoogleStrategy } from '../strategies/google.strategy';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(jwtStrategy: JwtStrategy, googleStrategy: GoogleStrategy) {
    passport.use(googleStrategy as any);
    passport.use(jwtStrategy);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request: Request = ctx.getContext()
      ? ctx.getContext().req
      : context.switchToHttp().getRequest();
    const auth = await this.authenticate(request);
    try {
      const user = await this.handleRequest(auth.user);
      request.user = user;
      ctx.getContext().user = user;
    } catch (error) {}
    return true;
  }

  async authenticate(
    request: Request,
  ): Promise<{ err: any; user: JwtPayload; info: any }> {
    return new Promise<{ err: any; user: any; info: any }>(
      (resolve, reject) => {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
          try {
            request.authInfo = info;
            resolve({ err, user, info });
          } catch (error) {
            reject(error);
          }
        })(request, null, err => (err ? reject(err) : resolve));
      },
    );
  }

  async handleRequest(user) {
    return user;
  }
}
