import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { APP_NAME } from 'src/app.constants';
import { Organization } from 'src/organization/entities';
import { User } from './../user/entities';
import { ElasticMailService } from './elastic-mail.service';
import { ElasticMailTemplateNames } from './elastic-mail.templates';

@Injectable()
export class MailService {
  private readonly clientURL = this.configService.get('CLIENT_URL');
  constructor(
    private mailerService: ElasticMailService,
    private configService: ConfigService,
  ) {}

  async welcomeRegisteredOrganization(user: User, organization: Organization) {
    const url = `${organization.slug}.${this.clientURL}`;

    await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        Subject: `Welcome to ${APP_NAME}! Make yourself at home`,
        TemplateName: ElasticMailTemplateNames.WelcomeToGembrs,
        Merge: {
          name: `${user.firstName}`,
          url,
          APP_NAME,
          organization: `${organization.name}`,
        },
      },
    });
  }

  async sendVerificationCode(user: User, code: number | string) {
    return await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        Subject: `${APP_NAME} – email verification`,
        TemplateName: ElasticMailTemplateNames.VerifyYourEmail,
        Merge: {
          name: `${user.firstName}`,
          code: `${code}`,
          APP_NAME,
        },
      },
    });
  }

  async resetPasswordRequest(user: User, link: string) {
    return await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        Subject: 'You requested for a Password reset!',
        TemplateName: './request-password-reset.template.hbs', // `.hbs` extension is appended automatically
        Merge: {
          name: `${user.firstName}`,
          link,
        },
      },
    });
  }

  async resetPassword(user: User) {
    const link = this.clientURL;
    return await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        Subject: 'Password Reset Successfully!',
        TemplateName: './password-reset.template.hbs', // `.hbs` extension is appended automatically
        Merge: {
          name: `${user.firstName}`,
          link,
          APP_NAME,
        },
      },
    });
  }

  async confirmUserEmail(user: User, token: string) {
    const url = `${this.clientURL}?token=${token}`;

    await this.mailerService.send({
      Recipients: { To: [user.email] },
      Content: {
        // from: '"Support Team" <support@example.com>', // override default from
        Subject: 'Welcome to Nice App! Confirm your Email',
        TemplateName: './confirm-email.template.hbs', // `.hbs` extension is appended automatically
        Merge: {
          name: `${user.firstName}`,
          url,
          APP_NAME,
        },
      },
    });
  }
}
