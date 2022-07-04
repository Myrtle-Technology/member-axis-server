import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './entities';
import {
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
  Crud,
} from '@rewiko/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from 'src/user/entities';

@ApiBearerAuth()
@ApiTags('roles')
@Crud({
  model: {
    type: Role,
  },
})
@Controller('roles')
export class RoleController implements CrudController<Role> {
  constructor(public service: RoleService) {}

  get base(): CrudController<Role> {
    return this;
  }

  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Override()
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
  ): Promise<Role> {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Role>,
  ): Promise<Role[]> {
    return this.base.createManyBase(req, dto);
  }

  @Override()
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
  ): Promise<Role> {
    return this.base.updateOneBase(req, dto);
  }

  @Override()
  replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Role,
  ): Promise<Role> {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  deleteOne(@ParsedRequest() req: CrudRequest): Promise<void | Role> {
    return this.base.deleteOneBase(req);
  }
}
