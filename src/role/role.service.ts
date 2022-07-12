import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';
import slugify from 'slugify';
import { Repository } from 'typeorm';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role, Permission } from './entities';
import { Role as RoleEnum } from './enums/role.enum';

@Injectable()
export class RoleService extends TypeOrmCrudService<Role> {
  logger = new Logger(RoleService.name);
  constructor(
    @InjectRepository(Role) repo,
    @InjectRepository(Permission)
    private permissionRepo: Repository<Permission>,
  ) {
    super(repo);
  }

  getDefaultAdminRole() {
    return this.findOne({ slug: RoleEnum.Admin });
  }

  getDefaultMemberRole() {
    return this.findOne({ slug: RoleEnum.Member });
  }

  async create(dto: CreateRoleDto[]) {
    return this.repo.save(dto, { chunk: 50 });
  }

  async findOrCreateRole(dto: Partial<Role>): Promise<Role> {
    try {
      let role = await this.repo.findOne({
        where: { slug: slugify(dto.slug) },
      });
      if (!role) {
        role = await this.repo.save(dto);
      }

      // if (role.permissions.length > 0) {
      await Promise.all(
        dto.permissions.map((permission) => {
          this.findOrCreatePermission(permission);
          role.permissions = [...role.permissions, permission];
        }),
      );
      // }
      role.save();
      return role;
    } catch (error) {
      console.log(error.message);
      return this.findOrCreateRole(dto);
    }
  }

  async findOrCreatePermission(dto: Partial<Permission>): Promise<Permission> {
    try {
      let permission = await this.permissionRepo.findOne({
        where: { resource: dto.resource, action: dto.action },
      });
      if (!permission) {
        permission = await this.permissionRepo.save(dto);
      }
      return permission;
    } catch (error) {
      console.log(error.message);
      return this.findOrCreatePermission(dto);
    }
  }
}
