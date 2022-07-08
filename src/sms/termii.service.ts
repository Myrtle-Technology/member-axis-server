import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { TermiiRequestParams } from './dto/termii-request-params.dto';
import { TermiiSendSmsResponse } from './interfaces/termii-send-sms-response.interface';

@Injectable()
export class TermiiService {
  private readonly TERMII_URL = 'https://termii.com/api';
  private readonly apiKey = this.configService.get<string>('TERMII_API_KEY');
  private axios = axios.create({
    baseURL: this.TERMII_URL,
    headers: {
      'Content-Type': 'Application/json',
      Accept: 'Application/json',
    },
  });
  private data: Partial<TermiiRequestParams> = {
    type: 'plain',
    api_key: this.apiKey,
  };

  constructor(private configService: ConfigService) {}

  private checkIfApiKeyIsSet() {
    if (!this.apiKey) {
      throw new Error(
        'TERMII_API_KEY is not set. Visit https://termii.com/account/api to get your api key',
      );
    }
  }

  async sendSms(
    to: string,
    message: string,
    from: string = null,
    channel: 'generic' | 'whatsapp' | 'dnd' = 'generic',
  ) {
    this.checkIfApiKeyIsSet();

    try {
      if (!from && channel === 'generic') {
        return await this.sendSMSFromRandomNumber(to, message);
      }
      if (!from && channel !== 'generic') {
        throw new InternalServerErrorException(
          "'From' phone number is required for non-generic channels",
        );
      }

      const response = await this.axios.post<TermiiSendSmsResponse>(
        '/sms/send',
        new TermiiRequestParams({
          to,
          sms: message,
          from,
          ...this.data,
          channel,
        }).toString(),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error;
    }
  }

  async sendSMSFromRandomNumber(to: string, message: string) {
    this.checkIfApiKeyIsSet();

    const response = await this.axios.post<TermiiSendSmsResponse>(
      '/sms/number/send',
      new TermiiRequestParams({
        to,
        sms: message,
        ...this.data,
      }).toString(),
    );
    return response.data;
  }

  async sendOtp(
    to: string,
    from: string,
    channel: 'generic' | 'whatsapp' | 'dnd' = 'generic',
  ) {
    this.checkIfApiKeyIsSet();

    try {
      const response = await this.axios.post(
        '/sms/otp/send',
        new TermiiRequestParams({
          api_key: this.apiKey,
          message_type: 'NUMERIC',
          to: to,
          from: from,
          channel: channel,
          pin_attempts: 10,
          pin_time_to_live: 5,
          pin_length: 6,
          pin_placeholder: '< 1234 >',
          message_text: 'Your pin is < 1234 >',
          pin_type: 'NUMERIC',
        }),
      );
      return response.data;
    } catch (error) {
      console.log(error.response.data);
      return error;
    }
  }

  async verifyOtp(pin_id: string, pin: string) {
    this.checkIfApiKeyIsSet();

    return (
      await this.axios.post(
        '/sms/otp/verify',
        new TermiiRequestParams({
          api_key: this.apiKey,
          pin_id,
          pin,
        }).toString(),
      )
    ).data;
  }
}
