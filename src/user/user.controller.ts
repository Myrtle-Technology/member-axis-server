import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import {
  CreateManyDto,
  Crud,
  CrudController,
  CrudRequest,
  Override,
  ParsedBody,
  ParsedRequest,
} from '@rewiko/crud';
import { User } from './entities';
import { DeepPartial } from 'typeorm';

@ApiBearerAuth()
@ApiTags('users')
@Crud({
  model: {
    type: User,
  },
})
@Controller('users')
export class UsersController implements CrudController<User> {
  constructor(public service: UserService) {}

  @Get('me')
  me(@Request() req) {
    return req.user;
  }

  @Post('me')
  @ApiBody({ type: UpdateUserDto })
  updateMe(
    @ParsedRequest() req,
    @Request() xReq,
    @Body() dto: DeepPartial<User>,
  ) {
    dto.id = (xReq as any).user.id;
    return this.service.updateOne(req, dto);
  }

  get base(): CrudController<User> {
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
    @ParsedBody() dto: User,
  ): Promise<User> {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<User>,
  ): Promise<User[]> {
    return this.base.createManyBase(req, dto);
  }

  @Override()
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ): Promise<User> {
    return this.base.updateOneBase(req, dto);
  }

  @Override()
  replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: User,
  ): Promise<User> {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  deleteOne(@ParsedRequest() req: CrudRequest): Promise<void | User> {
    return this.base.deleteOneBase(req);
  }
}
