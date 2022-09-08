import { ApiProperty } from '@nestjs/swagger';
import { CommonField } from 'src/common-field/entities/common-field.entity';
import { OrganizationMember } from 'src/organization-member/entities';
import { Organization } from 'src/organization/entities';
import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique('member_commonField', ['memberId', 'commonFieldId'])
export class MemberCommonField extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationId: number;
  @ManyToOne(() => Organization, (m) => m.commonFields)
  @JoinColumn({ name: 'organizationId' })
  @ApiProperty({ type: () => Organization })
  organization: Organization;

  @Column()
  memberId: number;

  @ManyToOne(() => OrganizationMember, (m) => m.commonFields)
  @JoinColumn({ name: 'memberId' })
  @ApiProperty({ type: () => OrganizationMember })
  member: OrganizationMember;

  @Column()
  commonFieldId: number;

  @ManyToOne(() => CommonField, (c) => c.members, { eager: true })
  @JoinColumn({ name: 'commonFieldId' })
  @ApiProperty({ type: () => CommonField })
  commonField: CommonField;

  @Column({ type: 'longtext' })
  value: string;

  constructor(data?: Partial<MemberCommonField>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
