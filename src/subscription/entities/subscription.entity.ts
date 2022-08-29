import { ApiProperty } from '@nestjs/swagger';
import { MembershipPlan } from 'src/membership-plan/entities/membership-plan.entity';
import { OrganizationMember } from 'src/organization-member/entities';
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
  memberId: number;

  @ManyToOne(() => OrganizationMember, (member) => member.subscriptions)
  @JoinColumn({ name: 'memberId' })
  @ApiProperty({ type: () => OrganizationMember })
  member: OrganizationMember;

  @Column()
  membershipPlanId: number;

  @ManyToOne(() => MembershipPlan, (member) => member.subscriptions)
  @JoinColumn({ name: 'memberId' })
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

  @Column({ type: 'datetime' })
  cancelAt: Date;

  @Column({ type: 'datetime' })
  canceledAt: Date;

  @Column({ type: 'datetime' })
  endedAt: Date;

  // @Column()
  // defaultPaymentMethod: "online" |"offline";

  // paymentId: number;

  // // for paystack
  // externalSubscriptionId: string;

  // metaData: Record<string, any>;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  constructor(member?: Partial<Subscription>) {
    super();
    if (member) Object.assign(this, member);
  }
}
