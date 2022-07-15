import { ApiProperty } from '@nestjs/swagger';
import { CommonField } from 'src/common-field/entities/common-field.entity';
import { OrganizationMember } from 'src/organization-member/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class MemberCommonField extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationMemberId: number;

  @ManyToOne(() => OrganizationMember, (m) => m.commonFields, {
    eager: true,
  })
  @JoinColumn({ name: 'organizationMemberId' })
  @ApiProperty({ type: () => OrganizationMember })
  organizationMember: OrganizationMember;

  @Column()
  commonFieldId: number;

  @ManyToOne(() => CommonField, (c) => c.members, { eager: true })
  @JoinColumn({ name: 'commonFieldId' })
  @ApiProperty({ type: () => CommonField })
  commonField: CommonField;

  @Column({ type: 'longtext' })
  value: string;
}
