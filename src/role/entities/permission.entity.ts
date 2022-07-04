import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { PermissionAction } from '../enums/permission-action.enum';
import { Resources } from '../enums/resources.enum';

@Entity()
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  resource: Resources;

  @Column()
  action: PermissionAction;

  @Column({ default: '*' })
  attributes: string; // '*, !rating, !views'

  constructor(permission?: Partial<Permission>) {
    super();
    Object.assign(this, permission);
  }
}
