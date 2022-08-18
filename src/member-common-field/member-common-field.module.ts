import { Module } from '@nestjs/common';
import { MemberCommonFieldService } from './member-common-field.service';
import { MemberCommonFieldController } from './member-common-field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberCommonField } from './entities/member-common-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemberCommonField])],
  controllers: [MemberCommonFieldController],
  providers: [MemberCommonFieldService],
  exports: [MemberCommonFieldService],
})
export class MemberCommonFieldModule {}
