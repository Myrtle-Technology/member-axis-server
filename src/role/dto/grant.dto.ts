import { Role } from '../entities/role.entity';
import { PermissionAction } from '../enums/permission-action.enum';
import { Resources } from '../enums/resources.enum';

export class GrantDto {
  role: string;
  constructor(
    public readonly _role: Role,
    public readonly action: PermissionAction,
    public readonly resource: Resources,
    public readonly attributes: string = '*',
  ) {
    this.action = action;
    this.resource = resource;
    this.role = _role.name;
  }
}
