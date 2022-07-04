import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';
import { User } from 'src/user/entities';
import { Role } from 'src/role/entities';
import { OrganizationMember } from 'src/organization-member/entities';

@Entity()
export class Organization {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column()
  @Index({ unique: true })
  slug: string;

  @IsNotEmpty()
  @IsEmail()
  @Column()
  contactEmail: string;

  @IsNotEmpty()
  @IsPhoneNumber()
  @Column()
  contactPhone: string;

  @IsOptional()
  @Column({ type: 'text', nullable: true })
  bio: string;

  @IsOptional()
  @Column({ nullable: true })
  logoUrl: string;

  @IsOptional()
  @Column({ nullable: true })
  address: string;

  @IsOptional()
  @Column({ nullable: true })
  state: string;

  @IsOptional()
  @Column({ nullable: true })
  country: string;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.ownedOrganizations)
  @JoinColumn({ name: 'ownerId' })
  owner: User;

  @OneToMany(() => Role, (role) => role.ownerOrganization)
  @JoinColumn({ name: 'ownerId' })
  roles: Role[];

  @Column()
  createdAt: Date;

  @Column() updatedAt: Date;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.organization,
  )
  organizationMembers: OrganizationMember[];
}
