import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Permission } from './permission.entity';
import { Organization } from 'src/organization/entities';
import { OrganizationMember } from 'src/organization-member/entities';

@Entity()
@Unique('organization_slug_unique', ['organizationId', 'slug'])
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column()
  @Index({ unique: true })
  slug: string;

  @IsOptional()
  @Column()
  description: string;

  permissions: Permission[];

  @Column({ nullable: true })
  organizationId: number;

  @ManyToOne(() => Organization, (organization) => organization.roles)
  @JoinColumn({ name: 'organizationId' })
  ownerOrganization: Organization;

  @CreateDateColumn() createdAt: Date;

  @UpdateDateColumn() updatedAt: Date;

  @OneToMany(
    () => OrganizationMember,
    (organizationMember) => organizationMember.role,
  )
  organizationMembers: OrganizationMember[];

  constructor(permission?: Partial<Role>) {
    super();
    Object.assign(this, permission);
  }
}
