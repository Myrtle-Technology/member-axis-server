import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  BaseEntity,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsPhoneNumber } from 'class-validator';
import { User } from 'src/user/entities';
import { Role } from 'src/role/entities';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { CrudRequestTypes } from 'nestjs-crud-microservice-validation/lib';
import { Organization } from 'src/organization/entities';
import { MetaInformation } from '../dto/meta-information.dto';

@Entity()
export class OrganizationMember extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (org) => org.organizationMembers, {
    eager: true,
  })
  @JoinColumn({ name: 'organizationId' })
  @ApiProperty({ type: () => Organization })
  organization: Organization;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.memberOrganizations, { eager: true })
  @JoinColumn({ name: 'userId' })
  @ApiProperty({ type: () => User })
  user: User;

  @Column()
  roleId: number;

  @ManyToOne(() => Role, (role) => role.organizationMembers)
  @JoinColumn({ name: 'roleId' })
  @ApiProperty({ type: () => Role })
  role: Role;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @IsPhoneNumber()
  @Column({ nullable: true })
  contactPhone: string;

  @Column({ nullable: true })
  officeTitle: string;

  @Exclude()
  @IsNotEmpty()
  @Column()
  @IsOptional({
    groups: [
      CrudRequestTypes.UPDATE,
      CrudRequestTypes.READ,
      CrudRequestTypes.DELETE,
    ],
  })
  password: string;

  @Column({ type: 'json', nullable: true })
  OtherInformation: MetaInformation[];

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  constructor(permission?: Partial<OrganizationMember>) {
    super();
    Object.assign(this, permission);
  }
}
