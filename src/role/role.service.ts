import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  logger = new Logger(RoleService.name);
  constructor(@InjectRepository(Role) repo) {
    super(repo);
  }
}
