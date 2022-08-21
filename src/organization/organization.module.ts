import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Organization } from './entities';
import { MemberCommonFieldModule } from 'src/member-common-field/member-common-field.module';
import { OrganizationMemberModule } from 'src/organization-member/organization-member.module';
import { MembershipPlanModule } from 'src/membership-plan/membership-plan.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Organization]),
    MemberCommonFieldModule,
    OrganizationMemberModule,
    MembershipPlanModule,
  ],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService, TypeOrmModule.forFeature([Organization])],
})
export class OrganizationModule {}
