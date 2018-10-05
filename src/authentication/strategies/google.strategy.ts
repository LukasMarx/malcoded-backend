import { Injectable, UnauthorizedException, HttpService } from '@nestjs/common';
import * as google from 'passport-google-oauth20';
import { ConfigService } from '../../common/services/config.service';
import { GoogleClientIdKey, GoogleClientSecretKey } from '../constants';
import { AuthService } from '../services/auth.service';
import { ApplicationDomainKey } from './../../constants';

@Injectable()
export class GoogleStrategy extends google.Strategy {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
    private httpService: HttpService,
  ) {
    super(
      {
        clientID: configService.get(GoogleClientIdKey),
        clientSecret: configService.get(GoogleClientSecretKey),
        callbackURL: `${configService.get(
          ApplicationDomainKey,
        )}/v1/api/auth/google/callback`,
      },
      (accessToken, refreshToken, profile, done) =>
        this.validate(accessToken, profile, done),
    );
  }

  async validate(accessToken, profile, done) {
    let image;
    if (profile.photos && profile.photos.length > 0) {
      image = await this.httpService
        .get(profile.photos[0].value, {
          responseType: 'arraybuffer',
        })
        .toPromise();
    }
    const token = await this.authService.singInWithOAuth({
      email: profile.emails[0].value,
      displayName: profile.displayName,
      provider: 'GOOGLE',
      providerId: profile.id,
      image: image.data,
    });
    if (!profile) {
      return done(new UnauthorizedException(), false);
    }
    return done(null, token);
  }
}
