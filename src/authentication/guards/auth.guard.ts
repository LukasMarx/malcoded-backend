import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import * as passport from 'passport';
import { JwtStrategy } from '../strategies/jwt.strategy';
import { UserService } from 'user/services/user.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(jwtStrategy: JwtStrategy) {
    passport.use(jwtStrategy);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const request: Request = ctx.getContext()
      ? ctx.getContext().req
      : context.switchToHttp().getRequest();
    const auth = await this.authenticate(request);
    try {
      const user = await this.handleRequest(auth.err, auth.user, auth.info);
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

  async handleRequest(err, user, info) {
    return user;
  }
}
