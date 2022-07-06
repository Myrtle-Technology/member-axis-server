import { User } from 'src/user/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  PrimaryGeneratedColumn,
  OneToOne,
  BaseEntity,
} from 'typeorm';

@Entity()
export class Token extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @OneToOne('User', 'token', { eager: true })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  token: string;

  @Index({ expireAfterSeconds: 1800 }) // 30 minutes
  @CreateDateColumn()
  createdAt: Date;
}
