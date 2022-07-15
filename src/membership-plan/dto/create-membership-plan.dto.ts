import { IsOptional } from 'class-validator';
import { PlanPaymentMethod } from '../enums/plan-payment-method';
import { PlanRenewalDuration } from '../enums/plan-renewal-duration';

export class CreateMembershipPlanDto {
  name: string;

  @IsOptional()
  description: string;

  membershipFee: number;

  paymentMethod: PlanPaymentMethod;

  isPublic: boolean;

  @IsOptional()
  memberCanChangeTo: boolean;

  renewalDuration: PlanRenewalDuration;

  renewalDurationCount: number;

  @IsOptional()
  approveApplication: boolean;

  @IsOptional()
  publishedAt: Date;

  @IsOptional()
  organizationId: number;
}
