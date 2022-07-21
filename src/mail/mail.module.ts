import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ElasticMailService } from './elastic-mail.service';

@Module({
  imports: [],
  providers: [MailService, ElasticMailService],
  exports: [MailService], // 👈 export for DI
})
export class MailModule {}
