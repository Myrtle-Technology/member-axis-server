import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SmsService } from './sms.service';
import { TermiiService } from './termii.service';

@Module({
  imports: [ConfigModule],
  providers: [SmsService, TermiiService],
  exports: [SmsService, TermiiService],
})
export class SmsModule {}
