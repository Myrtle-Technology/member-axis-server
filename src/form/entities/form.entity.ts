import { CommonField } from 'src/common-field/entities/common-field.entity';
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum FormType {
  MEMBERSHIP = 'membership',
  EVENT = 'event',
}

@Entity()
export class Form extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'enum', enum: FormType })
  type: string;

  @ManyToOne(() => CommonField, (c) => c.form)
  fields: CommonField[];
}
