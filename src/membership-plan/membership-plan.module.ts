import { Module } from '@nestjs/common';
import { MembershipPlanService } from './membership-plan.service';
import { MembershipPlanController } from './membership-plan.controller';
import { MembershipPlan } from './entities/membership-plan.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MembershipPlan])],
  controllers: [MembershipPlanController],
  providers: [MembershipPlanService],
  exports: [MembershipPlanService, TypeOrmModule.forFeature([MembershipPlan])],
})
export class MembershipPlanModule {}
