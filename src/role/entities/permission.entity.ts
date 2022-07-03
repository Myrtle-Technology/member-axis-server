import { Column } from 'typeorm';
import { PermissionAction } from '../enums/permission-action.enum';
import { Resources } from '../enums/resources.enum';

export class Permissions {
  @Column()
  resource: Resources;

  @Column()
  action: PermissionAction;

  @Column({ default: '*' })
  attributes: string; // '*, !rating, !views'

  constructor(resource: Resources, action: PermissionAction, attributes = '*') {
    this.resource = resource;
    this.action = action;
    this.attributes = attributes;
  }
}
