import { ApiProperty } from '@nestjs/swagger';
import { Form } from 'src/form/entities/form.entity';
import { MemberCommonField } from 'src/member-common-field/entities/member-common-field.entity';
import { Organization } from 'src/organization/entities';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { CommonFieldType } from '../enums/common-field-type.enum';
import { CommonFieldOption } from '../dto/common-field-option.dto';
import { CommonFieldAttributes } from '../dto/common-field-attributes.dto';

export enum CommonFieldPrivacy {
  NotVisible = 'not-visible',
  VisibleToMembers = 'visible-to-members',
  VisibleToPublic = 'visible-to-public',
}
@Entity()
@Unique('organization_commonFieldName', ['organizationId', 'name'])
export class CommonField extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    default: CommonFieldType.text,
    enum: CommonFieldType,
  })
  type: CommonFieldType;

  @Column({ type: 'json', nullable: true })
  @ApiProperty({ type: () => CommonFieldOption, isArray: true })
  options: CommonFieldOption[];

  @Column({ default: false })
  required: boolean;

  @Column({
    type: 'enum',
    default: CommonFieldPrivacy.NotVisible,
    enum: CommonFieldPrivacy,
  })
  privacy: CommonFieldPrivacy;

  @Column({ type: 'json', nullable: true })
  attributes: CommonFieldAttributes;

  @Column({ default: 10, type: 'int' })
  order: number;

  @OneToMany(() => MemberCommonField, (c) => c.commonField)
  @ApiProperty({ type: () => MemberCommonField, isArray: true })
  members: MemberCommonField[];

  @Column({ nullable: true })
  formId: number;

  @ManyToOne(() => Form, (c) => c.fields)
  form: Form;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (o) => o.commonFields)
  @ApiProperty({ type: () => Organization })
  organization: Organization;

  constructor(data?: Partial<CommonField>) {
    super();
    if (data) {
      Object.assign(this, data);
      this.options = this.options || [];
      this.attributes = this.attributes || {};
    }
  }
}
