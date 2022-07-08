import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_NAME } from 'src/app.constants';
import { Organization } from 'src/organization/entities';
import { User } from './../user/entities';

@Injectable()
export class MailService {
  private readonly clientURL = this.configService.get<number>('CLIENT_URL');
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async welcomeRegisteredOrganization(user: User, organization: Organization) {
    const url = this.clientURL;

    await this.mailerService.sendMail({
      to: user.email,
      subject: `Welcome to ${APP_NAME}! Make yourself at home`,
      template: './organization-registered.template.hbs', // `.hbs` extension is appended automatically
      context: {
        name: `${user.firstName}`,
        url,
        APP_NAME,
      },
    });
  }

  async sendVerificationCode(user: User, code: number) {
    return await this.mailerService.sendMail({
      to: user.email,
      subject: `${APP_NAME} – email verification`,
      template: './verify-email.template.hbs', // `.hbs` extension is appended automatically
      context: {
        name: `${user.firstName}`,
        code,
        APP_NAME,
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
        APP_NAME,
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
        APP_NAME,
      },
    });
  }

  async confirmUserEmail(user: User, token: string) {
    const url = `${this.clientURL}?token=${token}`;

    await this.mailerService.sendMail({
      to: user.email,
      // from: '"Support Team" <support@example.com>', // override default from
      subject: 'Welcome to Nice App! Confirm your Email',
      template: './confirm-email.template.hbs', // `.hbs` extension is appended automatically
      context: {
        name: `${user.firstName}`,
        url,
        APP_NAME,
      },
    });
  }
}
