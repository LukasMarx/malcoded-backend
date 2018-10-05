import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../../user/services/user.service';
import { EmailSignUpRequest } from '../interfaces/email-signup-request';
import { TokenObject } from '../interfaces/token-object';
import { HashingService } from '../../crypto/services/hashing.service';
import { OAuthSignupRequest } from '../interfaces/oauth-signup-request';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async signInWithEmail(
    emailSignUpRequest: EmailSignUpRequest,
  ): Promise<TokenObject> {
    try {
      const user = await this.usersService.findOneByEmail(
        emailSignUpRequest.email,
        'EMAIL',
      );

      if (
        await this.hashingService.compare(
          emailSignUpRequest.password,
          user.password,
        )
      ) {
        const token: JwtPayload = { email: user.email, provider: 'EMAIL' };
        const signedToken = this.jwtService.sign(token, {
          expiresIn: 3600 * 24,
        });
        return {
          access_token: signedToken,
          user: {
            id: user.id,
            displayName: user.displayName,
            image: user.image ? user.image.toString('base64') : null,
          },
        };
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async singInWithOAuth(oAuthSignupRequest: OAuthSignupRequest) {
    const user = await this.usersService.createFromOAuth(oAuthSignupRequest);
    const token: JwtPayload = {
      email: oAuthSignupRequest.email,
      provider: oAuthSignupRequest.provider,
    };
    const signedToken = this.jwtService.sign(token, {
      expiresIn: 3600 * 24,
    });
    return {
      access_token: signedToken,
      user: {
        id: user.id,
        displayName: oAuthSignupRequest.displayName,
        image: oAuthSignupRequest.image
          ? oAuthSignupRequest.image.toString('base64')
          : null,
      },
    };
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findOneByEmail(
      payload.email,
      payload.provider,
    );
  }
}
