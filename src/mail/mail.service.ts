import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from './../user/entities';

@Injectable()
export class MailService {
  sendVerificationCode(email: string, code: number) {
    throw new Error('Method not implemented.');
  }
  private readonly clientURL = this.configService.get<number>('CLIENT_URL');
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async welcomeRegisteredUser(user: User) {
    const url = this.clientURL;

    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Tritech Agric!',
      template: './registered.template.hbs', // `.hbs` extension is appended automatically
      context: {
        name: `${user.firstName}`,
        url,
      },
    });
  }

  async resetPasswordRequest(user: User, link: string) {
    return await this.mailerService.sendMail({
      to: user.email,
      subject: 'You requested for a Password reset!',
      template: './request-password-reset.template.hbs', // `.hbs` extension is appended automatically
      context: {
        name: `${user.firstName}`,
        link,
      },
    });
  }

  async resetPassword(user: User) {
    const link = this.clientURL;
    return await this.mailerService.sendMail({
      to: user.email,
      subject: 'Password Reset Successfully!',
      template: './password-reset.template.hbs', // `.hbs` extension is appended automatically
      context: {
        name: `${user.firstName}`,
        link,
      },
    });
  }

  async confirmUserEmail(user: User, token: string) {
    const url = `${this.clientURL}?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confrim-email.template.hbs', // `.hbs` extension is appended automatically
      context: {
        name: `${user.firstName}`,
        url,
      },
    });
  }
}
