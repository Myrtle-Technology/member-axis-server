import { MemberCommonField } from 'src/member-common-field/entities/member-common-field.entity';
import { Organization } from 'src/organization/entities';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum CommonFieldType {
  text = 'text',
  date = 'date',
  datetime = 'datetime',
  number = 'number',
  boolean = 'boolean',
  select = 'select',
  checkbox = 'checkbox',
  file = 'file',
}

@Entity()
export class CommonField extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  label: string;

  @Column({
    default: 'text',
    enum: Object.values(CommonFieldType),
    enumName: 'CommonFieldType',
  })
  type: CommonFieldType;

  @Column({ type: 'json' })
  options: string[];

  @Column({ default: false })
  required: boolean;

  @OneToMany(() => MemberCommonField, (c) => c.commonField)
  members: MemberCommonField[];

  // @OneToMany(() => FormCommonField, (c) => c.commonField)
  // forms: FormCommonField[];

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
