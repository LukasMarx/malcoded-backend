import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtPayload } from '../interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'user/services/user.service';
import { EmailSignUpRequest } from '../interfaces/email-signup-request';
import { TokenObject } from '../interfaces/token-object';
import { HashingService } from 'crypto/services/hashing.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
    private readonly hashingService: HashingService,
  ) {}

  async signIn(emailSignUpRequest: EmailSignUpRequest): Promise<TokenObject> {
    try {
      const user = await this.usersService.findOneByEmail(
        emailSignUpRequest.email,
      );

      if (
        await this.hashingService.compare(
          emailSignUpRequest.password,
          user.password,
        )
      ) {
        const token: JwtPayload = { email: user.email };
        const signedToken = this.jwtService.sign(token, {
          expiresIn: 3600 * 24,
        });
        return {
          access_token: signedToken,
        };
      }
    } catch (error) {
      throw new BadRequestException();
    }
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    return await this.usersService.findOneByEmail(payload.email);
  }
}
