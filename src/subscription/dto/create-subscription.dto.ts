import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { PlanPaymentMethod } from 'src/membership-plan/enums/plan-payment-method';
import { SubscriptionStatus } from '../enums/subscription-status.enum';

export class CreateSubscriptionDto {
  @Exclude()
  organizationId: number;

  @Exclude()
  memberId: number;

  membershipPlanId: number;

  @ApiProperty({ type: () => SubscriptionStatus })
  status: SubscriptionStatus;

  currentPeriodStart: Date;

  currentPeriodEnd: Date;

  cancelAtPeriodEnd: boolean;

  cancelAt?: Date;

  canceledAt?: Date;

  endedAt?: Date;

  @ApiProperty({ type: () => PlanPaymentMethod })
  defaultPaymentMethod: PlanPaymentMethod;
}
