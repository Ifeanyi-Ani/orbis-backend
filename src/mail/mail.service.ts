import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
  private transporter;

  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: configService.get('SMTP_HOST'),
      port: configService.get('SMTP_PORT'),
      secure: true,
      auth: {
        user: configService.get('SMTP_USER'),
        pass: configService.get('SMTP_PASS'),
      },
    });
  }
  public async sendVerificationEmail(email: string, token: string) {
    const verificationLink = `${this.configService.get('FRONTEND_URL')}/verify-email?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'verify your email address',
      html: `
            <h1>Welcome to Orbis Hospital</h1>
            <p>Please click the link below to verify your email address:</p>
            <a href="${verificationLink}">Verify Email</a>
            <p>This link will expire in 24 hours.</p>
            `,
    });
  }

  public async sendSetPasswordEmail(email: string, token: string) {
    const setPasswordLink = `${this.configService.get('FRONTEND_URL')}/set-password?token=${token}`;

    await this.transporter.sendMail({
      from: this.configService.get('MAIL_FROM'),
      to: email,
      subject: 'Set Your Password',
      html: `
              <h1>Set Your Password</h1>
              <p>Please click the link below to set your password:</p>
              <a href="${setPasswordLink}">Set Password</a>
              <p>This link will expire in 24 hours.</p>
            `,
    });
  }
}
