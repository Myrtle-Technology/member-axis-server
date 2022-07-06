import { IsNumber } from 'class-validator';
import { IsUsername } from '../decorators/is-username.decorator';

export class VerifyOtpDto {
  @IsUsername()
  username: string;

  @IsNumber()
  otp: number;
}
