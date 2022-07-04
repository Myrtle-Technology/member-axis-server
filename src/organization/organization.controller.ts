import { Controller } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  CreateManyDto,
  Crud,
} from '@rewiko/crud';
import { Organization } from './entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiBearerAuth()
@ApiTags('organizations')
@Crud({
  model: {
    type: Organization,
  },
})
@Controller('organizations')
export class OrganizationController implements CrudController<Organization> {
  constructor(public service: OrganizationService) {}

  get base(): CrudController<Organization> {
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
    @ParsedBody() dto: Organization,
  ): Promise<Organization> {
    return this.base.createOneBase(req, dto);
  }

  @Override()
  createMany(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: CreateManyDto<Organization>,
  ): Promise<Organization[]> {
    return this.base.createManyBase(req, dto);
  }

  @Override()
  updateOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Organization,
  ): Promise<Organization> {
    return this.base.updateOneBase(req, dto);
  }

  @Override()
  replaceOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Organization,
  ): Promise<Organization> {
    return this.base.replaceOneBase(req, dto);
  }

  @Override()
  deleteOne(@ParsedRequest() req: CrudRequest): Promise<void | Organization> {
    return this.base.deleteOneBase(req);
  }
}
