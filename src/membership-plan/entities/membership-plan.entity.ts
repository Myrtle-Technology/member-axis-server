import { ApiProperty } from '@nestjs/swagger';
import { Organization } from 'src/organization/entities';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { PlanPaymentMethod } from '../enums/plan-payment-method';
import { PlanRenewalDuration } from '../enums/plan-renewal-duration';

@Entity()
export class MembershipPlan extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 0.0, type: 'double' })
  membershipFee: number;

  @Column({
    type: 'enum',
    default: PlanPaymentMethod.offline,
    enum: PlanPaymentMethod,
  })
  paymentMethod: PlanPaymentMethod;

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  memberCanChangeTo: boolean;

  @Column({
    default: PlanRenewalDuration.never,
    enum: PlanRenewalDuration,
    type: 'enum',
  })
  renewalDuration: PlanRenewalDuration;

  @Column({ default: 0, type: 'int' })
  renewalDurationCount: number;

  @Column({ default: false })
  approveApplication: boolean;
  // Todo: enable activation email to admin / organization contact email.
  // Todo: enable email to member when approved.

  @Column({ nullable: true })
  publishedAt: Date;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (org) => org.membershipPlans)
  @JoinColumn({ name: 'organizationId' })
  @ApiProperty({ type: () => Organization })
  organization: Organization;
}
