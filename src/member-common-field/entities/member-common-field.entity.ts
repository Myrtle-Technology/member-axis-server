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
@Unique('organizationMember_commonField', [
  'organizationMemberId',
  'commonFieldId',
])
export class MemberCommonField extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  organizationId: number;
  @ManyToOne(() => Organization, (m) => m.commonFields, {
    eager: true,
  })
  @JoinColumn({ name: 'organizationId' })
  @ApiProperty({ type: () => Organization })
  organization: Organization;

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

  constructor(data?: Partial<MemberCommonField>) {
    super();
    if (data) {
      Object.assign(this, data);
    }
  }
}
