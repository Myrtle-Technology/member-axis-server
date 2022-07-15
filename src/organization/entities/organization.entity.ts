import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
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
import { CommonField } from 'src/common-field/entities/common-field.entity';

@Entity()
@Unique('slug_unique', ['slug'])
export class Organization {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column()
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
  roles: Role[];

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.organization,
  )
  organizationMembers: OrganizationMember[];

  @OneToMany(() => CommonField, (commonField) => commonField.organization)
  commonFields: any;
}
