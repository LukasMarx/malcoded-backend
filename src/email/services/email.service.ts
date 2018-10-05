import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { Transporter } from 'nodemailer';
import { Email } from '../interfaces/email.interface';
import { SmtpHost, SmtpUserKey, SmtpPasswordKey } from '../constants';
import { ConfigService } from '../../common/services/config.service';

@Injectable()
export class EmailService {
  private transporter: Transporter;

  constructor(configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: SmtpHost,
      auth: {
        user: configService.get(SmtpUserKey),
        pass: configService.get(SmtpPasswordKey),
      },
    });
  }

  async sendEmail(email: Email) {
    this.transporter.sendMail({
      from: email.from,
      to: email.to,
      subject: email.subject,
      html: email.html,
    });
  }
}
