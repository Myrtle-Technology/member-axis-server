import { Injectable } from '@nestjs/common';
import { isPhoneNumber } from 'class-validator';
import { APP_NAME } from 'src/app.constants';
import { TermiiService } from './termii.service';

@Injectable()
export class SmsService {
  constructor(private termii: TermiiService) {}

  sendWelcomeSMS(phone: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.sendSms(
      phone.replace('+', ''),
      `Welcome to ${APP_NAME}`,
      APP_NAME,
    );
  }

  sendOTPLocal(phone: string, otp: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.sendSms(
      phone.replace('+', ''),
      `Your otp is ${otp} from ${APP_NAME}`,
    );
  }

  verifyOTP(phone: string, otp: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.verifyOtp(phone.replace('+', ''), otp);
  }

  sendOTP(phone: string) {
    if (!isPhoneNumber(phone)) {
      throw Error('Invalid phone number');
    }
    return this.termii.sendOtp(phone.replace('+', ''), 'Gembrs', 'dnd');
  }
}
