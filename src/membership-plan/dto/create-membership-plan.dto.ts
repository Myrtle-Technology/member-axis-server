import { ApiProperty } from '@nestjs/swagger';
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
import { BundleAdministratorWorkflowSettings } from './bundle-administrator-workflow-settings.dto';
import { RenewalReminder } from './renewal-reminder.dto';

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

  @IsEnum(PlanRenewalDuration)
  renewalDuration: PlanRenewalDuration;

  renewalDurationCount: number;

  @IsOptional()
  approveApplication: boolean;

  @IsOptional()
  publishedAt: Date;

  @IsOptional()
  organizationId: number;

  @ApiProperty({ type: () => BundleAdministratorWorkflowSettings })
  bundleAdministratorWorkflowSettings: BundleAdministratorWorkflowSettings;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderAfter1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderAfter2: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderBefore1: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderBefore2: RenewalReminder;

  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderOnDueDate: RenewalReminder;
}
