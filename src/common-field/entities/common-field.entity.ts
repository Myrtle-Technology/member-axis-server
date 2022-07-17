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

export enum CommonFieldType {
  text = 'text',
  password = 'password',
  date = 'date',
  datetime = 'datetime',
  number = 'number',
  boolean = 'boolean',
  select = 'select',
  file = 'file',
  checkbox = 'checkbox',
  radio = 'radio',
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

  @Column({
    type: 'enum',
    default: CommonFieldType.text,
    enum: CommonFieldType,
  })
  type: CommonFieldType;

  @Column({ type: 'json', nullable: true })
  options: string[];

  @Column({ default: false })
  required: boolean;

  @Column({ default: 10, type: 'int' })
  order: number;

  @OneToMany(() => MemberCommonField, (c) => c.commonField)
  members: MemberCommonField[];

  @Column({ nullable: true })
  formId: number;

  @ManyToOne(() => Form, (c) => c.fields)
  form: Form;

  @Column()
  organizationId: number;

  @ManyToOne(() => Organization, (o) => o.commonFields)
  organization: Organization;

  constructor(data?: Partial<CommonField>) {
    super();
    if (data) {
      Object.assign(this, data);
      this.options = this.options || [];
    }
  }
}
