import {
  Injectable,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from './auth.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';

@Injectable()
export class RolesGuard extends AuthGuard {
  constructor(private readonly reflector: Reflector, jwtStrategy: JwtStrategy) {
    super(jwtStrategy);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const hasJwt = await super.canActivate(context);
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    } else if (!hasJwt) {
      return false;
    }

    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;

    const user = request.user;
    const hasRole = () => user.roles.some(role => roles.includes(role));
    return user && user.roles && hasRole();
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      throw err || new ForbiddenException();
    }
    return user;
  }
}
