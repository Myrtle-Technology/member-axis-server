import { ApiProperty } from '@nestjs/swagger';
import { MembershipPlan } from 'src/membership-plan/entities/membership-plan.entity';
import { PlanPaymentMethod } from 'src/membership-plan/enums/plan-payment-method';
import { OrganizationMember } from 'src/organization-member/entities';
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
import { SubscriptionStatus } from '../enums/subscription-status.enum';

@Entity()
export class Subscription extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  organizationId: number;
  @ManyToOne(() => Organization, (m) => m.commonFields)
  @JoinColumn({ name: 'organizationId' })
  @ApiProperty({ type: () => Organization })
  organization: Organization;

  @Column()
  memberId: number;

  @ManyToOne(() => OrganizationMember, (member) => member.subscriptions)
  @JoinColumn({ name: 'memberId' })
  @ApiProperty({ type: () => OrganizationMember })
  member: OrganizationMember;

  @Column()
  membershipPlanId: number;

  @ManyToOne(() => MembershipPlan, (member) => member.subscriptions)
  @JoinColumn({ name: 'membershipPlanId' })
  @ApiProperty({ type: () => MembershipPlan })
  membershipPlan: MembershipPlan;

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.Pending,
  })
  status: SubscriptionStatus;

  @Column({ type: 'datetime' })
  currentPeriodStart: Date;

  @Column({ type: 'datetime' })
  currentPeriodEnd: Date;

  @Column({ default: true })
  cancelAtPeriodEnd: boolean;

  @Column({ type: 'datetime', nullable: true })
  cancelAt: Date;

  @Column({ type: 'datetime', nullable: true })
  canceledAt: Date;

  @Column({ type: 'datetime', nullable: true })
  endedAt: Date;

  @Column({
    type: 'enum',
    enum: PlanPaymentMethod,
    default: PlanPaymentMethod.Offline,
  })
  defaultPaymentMethod: PlanPaymentMethod;

  // paymentId: number;

  // metaData: Record<string, any>;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  constructor(member?: Partial<Subscription>) {
    super();
    if (member) Object.assign(this, member);
  }
}
