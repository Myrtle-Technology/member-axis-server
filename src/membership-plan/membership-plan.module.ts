import { Module } from '@nestjs/common';
import { MembershipPlanService } from './membership-plan.service';
import { MembershipPlanController } from './membership-plan.controller';
import { MembershipPlan } from './entities/membership-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemberCommonFieldModule } from 'src/member-common-field/member-common-field.module';
import { OrganizationMemberModule } from 'src/organization-member/organization-member.module';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MembershipPlan]),
    MemberCommonFieldModule,
  ],
  controllers: [MembershipPlanController],
  providers: [MembershipPlanService],
  exports: [MembershipPlanService, TypeOrmModule.forFeature([MembershipPlan])],
})
export class MembershipPlanModule {}
