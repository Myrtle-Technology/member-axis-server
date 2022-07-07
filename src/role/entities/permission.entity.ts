import {
  BaseEntity,
  Column,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { PermissionAction } from '../enums/permission-action.enum';
import { Resources } from '../enums/resources.enum';
import { Role } from './role.entity';

@Entity()
@Unique('permission_unique', ['resource', 'action'])
export class Permission extends BaseEntity {
  @PrimaryGeneratedColumn() id: number;

  @Column()
  resource: Resources;

  @Column()
  action: PermissionAction;

  @Column({ default: '*' })
  attributes: string; // '*, !rating, !views'

  @ManyToMany(() => Role, (role) => role.permissions)
  roles: Role[];

  constructor(permission?: Partial<Permission>) {
    super();
    Object.assign(this, permission);
  }
}
