import {
  Configuration,
  EmailsApi,
  EmailMessageData,
  EmailSend,
  EmailTransactionalMessageData,
  TemplatesApi,
  Template,
} from '@elasticemail/elasticemail-client-ts-axios';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosResponse } from 'axios';

@Injectable()
export class ElasticMailService {
  logger = new Logger(ElasticMailService.name);
  fromMail = this.configService.get<string>('MAIL_FROM');
  private config = new Configuration({
    apiKey: this.configService.get<string>('MAIL_API_KEY'),
  });
  private emailsApi = new EmailsApi(this.config);
  templatesApi = new TemplatesApi(this.config);

  constructor(private readonly configService: ConfigService) {}

  private async sendMail(
    data: EmailTransactionalMessageData,
  ): Promise<AxiosResponse<EmailSend>> {
    try {
      const response = await this.emailsApi.emailsTransactionalPost(data);
      this.logger.log(
        `MessageID: ${response.data.MessageID} | TransactionID: ${response.data.TransactionID} | Email API called successfully.`,
        ElasticMailService.name,
      );
      return response;
    } catch (error) {
      this.logger.error(error.message, error, ElasticMailService.name);
    }
  }

  async send(
    data: EmailTransactionalMessageData,
  ): Promise<AxiosResponse<EmailSend>> {
    try {
      const emailData: EmailTransactionalMessageData = {
        ...data,
        Content: {
          From: this.fromMail,
          ReplyTo: this.fromMail,
          ...data.Content,
        },
      };
      return this.sendMail(emailData);
    } catch (error) {
      this.logger.error(error.message, error, ElasticMailService.name);
    }
  }

  private async sendBulkMail(
    data: EmailMessageData,
  ): Promise<AxiosResponse<EmailSend>> {
    try {
      const response = await this.emailsApi.emailsPost(data);
      this.logger.log(
        `MessageID: ${response.data.MessageID} | TransactionID: ${response.data.TransactionID} | Email API called successfully.`,
        ElasticMailService.name,
      );
      return response;
    } catch (error) {
      this.logger.error(error.message, error, ElasticMailService.name);
    }
  }

  async sendBulk(
    data: Omit<EmailMessageData, 'Content.Body'>,
  ): Promise<AxiosResponse<EmailSend>> {
    const emailMessageData: EmailMessageData = {
      ...data,
      Content: {
        From: this.fromMail,
        ReplyTo: this.fromMail,
        ...data.Content,
      },
    };
    return this.sendBulkMail(emailMessageData);
  }

  async loadTemplate(templateName: string): Promise<Template> {
    const response = await this.templatesApi.templatesByNameGet(templateName);
    return response.data;
  }
}
