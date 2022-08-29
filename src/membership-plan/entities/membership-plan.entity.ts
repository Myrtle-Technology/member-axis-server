import { ApiProperty } from '@nestjs/swagger';
import { Organization } from 'src/organization/entities';
import { Subscription } from 'src/subscription/entities/subscription.entity';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { BundleAdministratorWorkflowSettings } from '../dto/bundle-administrator-workflow-settings.dto';
import { RenewalReminder } from '../dto/renewal-reminder.dto';
import { RenewalReminderWhen } from '../enums/renewal-reminder-when.enum';
import { PlanPaymentMethod } from '../enums/plan-payment-method';
import { PlanRenewalDuration } from '../enums/plan-renewal-duration';
import { PlanType } from '../enums/plan-type';

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
    default: PlanPaymentMethod.Offline,
    enum: PlanPaymentMethod,
  })
  paymentMethod: PlanPaymentMethod;

  @Column({
    type: 'enum',
    default: PlanType.Individual,
    enum: PlanType,
  })
  type: PlanType;

  @Column({ default: true })
  isPublic: boolean;

  @ManyToMany(() => MembershipPlan)
  @JoinTable({ joinColumn: { name: 'membershipPlanId_1' } })
  changeableTo: MembershipPlan[];

  @Column({
    default: PlanRenewalDuration.Never,
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

  @Column({ type: 'json', nullable: false })
  @ApiProperty({ type: () => BundleAdministratorWorkflowSettings })
  bundleAdministratorWorkflowSettings: BundleAdministratorWorkflowSettings;

  @Column({ type: 'json', nullable: false })
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderBefore1: RenewalReminder;

  @Column({ type: 'json', nullable: false })
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderBefore2: RenewalReminder;

  @Column({ type: 'json', nullable: false })
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderOnDueDate: RenewalReminder;

  @Column({ type: 'json', nullable: false })
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderAfter1: RenewalReminder;

  @Column({ type: 'json', nullable: false })
  @ApiProperty({ type: () => RenewalReminder })
  renewalReminderAfter2: RenewalReminder;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (org) => org.membershipPlans)
  @JoinColumn({ name: 'organizationId' })
  @ApiProperty({ type: () => Organization })
  organization: Organization;

  @OneToMany(() => Subscription, (subscription) => subscription.membershipPlan)
  subscriptions: Subscription[];

  // for paystack (or paystackPlanId)
  // externalPlanId: string;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  constructor(dto?: Partial<MembershipPlan>) {
    super();
    if (dto) {
      Object.assign(this, dto);
    }

    // Setup defaults
    this.bundleAdministratorWorkflowSettings =
      this.bundleAdministratorWorkflowSettings ??
      new BundleAdministratorWorkflowSettings({
        membershipMustBeApprovedByAdmin: true,
        paymentMustBeReceivedBeforeMemberActivated: true,
      });

    this.renewalReminderBefore1 =
      this.renewalReminderBefore1 ??
      new RenewalReminder({
        noOfDays: 14,
        when: RenewalReminderWhen.Before,
        sendEmail: false,
        sendEmailTo: [],
      });
    this.renewalReminderBefore2 =
      this.renewalReminderBefore2 ??
      new RenewalReminder({
        noOfDays: 7,
        when: RenewalReminderWhen.Before,
        sendEmail: false,
        sendEmailTo: [],
      });
    this.renewalReminderAfter1 =
      this.renewalReminderAfter1 ??
      new RenewalReminder({
        noOfDays: 7,
        when: RenewalReminderWhen.After,
        sendEmail: false,
        sendEmailTo: [],
        changeMembershipLevelTo: null,
      });
    this.renewalReminderAfter2 =
      this.renewalReminderAfter2 ??
      new RenewalReminder({
        noOfDays: 14,
        when: RenewalReminderWhen.After,
        sendEmail: false,
        sendEmailTo: [],
      });
    this.renewalReminderOnDueDate =
      this.renewalReminderOnDueDate ??
      new RenewalReminder({
        noOfDays: 0,
        when: RenewalReminderWhen.On,
        sendEmail: false,
        sendEmailTo: [],
      });
  }
}
