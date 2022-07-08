import { Controller } from '@nestjs/common';
import { OrganizationMemberService } from './organization-member.service';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMember } from './entities';
import {
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
  Crud,
  CrudAuth,
} from '@rewiko/crud';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UseRoles } from 'nest-access-control';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('members')
@CrudAuth({
  filter: (user: OrganizationMember) => ({
    organizationId: user.organizationId,
  }),
  property: 'user',
})
@Crud({
  model: {
    type: OrganizationMember,
  },
})
@Controller('members')
export class OrganizationMemberController
  implements CrudController<OrganizationMember>
{
  constructor(public service: OrganizationMemberService) {}

  get base(): CrudController<OrganizationMember> {
    return this;
  }

  @UseRoles({ action: 'read', resource: 'members', possession: 'own' })
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
    @ParsedBody() dto: OrganizationMember,
  ): Promise<OrganizationMember> {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<OrganizationMember>,
  ): Promise<OrganizationMember[]> {
    return this.base.createManyBase(req, dto);
  }

  @Override()
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: OrganizationMember,
  ): Promise<OrganizationMember> {
    return this.base.updateOneBase(req, dto);
  }

  @Override()
  replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: OrganizationMember,
  ): Promise<OrganizationMember> {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  deleteOne(
    @ParsedRequest() req: CrudRequest,
  ): Promise<void | OrganizationMember> {
    return this.base.deleteOneBase(req);
  }
}
