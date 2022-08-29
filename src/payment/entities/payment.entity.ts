import { BaseEntity, Entity, PrimaryGeneratedColumn } from 'typeorm';

// @Entity()
export class Payment extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
}
