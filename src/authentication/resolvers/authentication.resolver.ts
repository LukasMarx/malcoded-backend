import { Resolver, Query, Args } from '@nestjs/graphql';
import { AuthService } from '../services/auth.service';
import { BadRequestException } from '@nestjs/common';

@Resolver('User')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Query()
  async signUpWithEmail(@Args('signUpRequest') signUpRequest) {
    return (
      (await this.authService.signInWithEmail(signUpRequest)) ||
      new BadRequestException()
    );
  }
}
