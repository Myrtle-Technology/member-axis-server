import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { PlanPaymentMethod } from '../enums/plan-payment-method';
import { PlanRenewalDuration } from '../enums/plan-renewal-duration';

export class CreateMembershipPlanDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsNumber()
  membershipFee: number;

  @IsEnum(PlanPaymentMethod)
  paymentMethod: PlanPaymentMethod;

  @IsBoolean()
  isPublic: boolean;

  @IsOptional()
  @IsArray()
  memberCanChangeTo: number[];

  renewalDuration: PlanRenewalDuration;

  renewalDurationCount: number;

  @IsOptional()
  approveApplication: boolean;

  @IsOptional()
  publishedAt: Date;

  @IsOptional()
  organizationId: number;
}
