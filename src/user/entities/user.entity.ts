import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Organization } from 'src/organization/entities';
import { OrganizationMember } from 'src/organization-member/entities';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column({ nullable: true, default: ' ' }) firstName: string;

  @Column({ nullable: true, default: ' ' }) lastName: string;

  @IsEmail()
  @Column({ nullable: true })
  @Index({ unique: true })
  email: string;

  @IsPhoneNumber()
  @Column({ nullable: true })
  @Index({ unique: true })
  phone: string;

  @Column({ type: 'boolean', default: false })
  verified: boolean;

  @OneToMany(() => Organization, (organization) => organization.owner)
  ownedOrganizations: User[];

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.user,
  )
  memberOrganizations: OrganizationMember[];

  constructor(permission?: Partial<User>) {
    super();
    Object.assign(this, permission);
  }
}
