import { Controller, Get, Res, Req, HttpService } from '@nestjs/common';
import * as passport from 'passport';
import { ConfigService } from '../../common/services/config.service';
import { ClientBaseUrlKey } from './../../constants';

@Controller('auth')
export class AuthenticationController {
  constructor(
    private readonly httpService: HttpService,
    private configService: ConfigService,
  ) {}

  @Get('/google')
  async authWithGoogle(@Req() req, @Res() res) {
    passport.authenticate('google', { scope: ['profile', 'email'] })(req, res);
  }

  @Get('/google/callback')
  async authWithGoogleCallback(@Req() req, @Res() res) {
    passport.authenticate('google', (err, token, info) => {
      res.send(
        '<script>opener.postMessage(' +
          JSON.stringify({ sender: 'malcoded', token: token }) +
          ',"' +
          this.configService.get(ClientBaseUrlKey) +
          '"); window.close()</script>',
      );
    })(req, res);
  }
}
