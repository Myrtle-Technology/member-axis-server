import {
  BaseEntity,
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Exclude } from 'class-transformer';
import { Organization } from 'src/organization/entities';
import { OrganizationMember } from 'src/organization-member/entities';

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column() firstName: string;

  @Column() lastName: string;

  @IsEmail()
  @Column()
  @Index({ unique: true })
  email: string;

  @IsPhoneNumber()
  @Column()
  @Index({ unique: true })
  phone: string;

  @Exclude()
  @Column()
  password: string;

  @OneToMany(() => Organization, (organization) => organization.owner)
  ownedOrganizations: User[];

  @Column() createdAt: Date;

  @Column() updatedAt: Date;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.member,
  )
  memberOrganizations: OrganizationMember[];

  constructor(permission?: Partial<User>) {
    super();
    Object.assign(this, permission);
  }
}
