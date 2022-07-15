import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Membership extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: 0.0, type: 'double' })
  membershipFee: number;

  @Column({
    default: 'offline',
    enum: ['offline', 'online'],
    enumName: 'PaymentMethod',
  })
  paymentMethod: 'offline' | 'online';

  @Column({ default: true })
  isPublic: boolean;

  @Column({ default: false })
  memberCanChangeTo: boolean;

  @Column()
  renewalDuration: 'never' | 'day' | 'week' | 'month' | 'year' | 'lifetime';

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
}
