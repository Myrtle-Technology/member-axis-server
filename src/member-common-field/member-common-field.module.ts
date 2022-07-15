import { Module } from '@nestjs/common';
import { MemberCommonFieldService } from './member-common-field.service';
import { MemberCommonFieldController } from './member-common-field.controller';

@Module({
  controllers: [MemberCommonFieldController],
  providers: [MemberCommonFieldService]
})
export class MemberCommonFieldModule {}
