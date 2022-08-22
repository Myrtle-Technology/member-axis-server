import { Controller, Get, Request } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import {
  CrudController,
  Override,
  ParsedRequest,
  CrudRequest,
  ParsedBody,
  Crud,
} from '@rewiko/crud';
import { Organization } from './entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { Permit } from 'src/role/decorators/permit.decorator';
import { Resources } from 'src/role/enums/resources.enum';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';

@ApiBearerAuth()
@ApiTags('organizations')
@Crud({
  model: {
    type: Organization,
  },
  routes: {
    exclude: ['createManyBase', 'replaceOneBase', 'recoverOneBase'],
  },
  query: {
    join: { membershipPlans: { eager: true } },
  },
})
@Controller('organizations')
export class OrganizationController implements CrudController<Organization> {
  constructor(public service: OrganizationService) {}

  @Get('/registration-form')
  @Public()
  @OrganizationApi()
  getRegistrationForm(@Request() request: TokenRequest) {
    this.service.organizationId = request.organizationId;
    return this.service.getRegistrationFormFields();
  }

  get base(): CrudController<Organization> {
    return this;
  }

  @Public()
  @Override()
  getMany(@ParsedRequest() req: CrudRequest) {
    return this.base.getManyBase(req);
  }

  @Public()
  @Override()
  getOne(@ParsedRequest() req: CrudRequest) {
    return this.base.getOneBase(req);
  }

  @Permit({
    resource: Resources.Organization,
    action: 'create',
    possession: 'any',
  })
  @Override()
  createOne(
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: Organization,
  ): Promise<Organization> {
    return this.base.createOneBase(req, dto);
  }

  @Permit({
    resource: Resources.Organization,
    action: 'update',
    possession: 'any',
  })
  @Override()
  updateOne(
    @Request() xReq: TokenRequest,
    @ParsedRequest() req: CrudRequest,
    @ParsedBody() dto: UpdateOrganizationDto,
  ): Promise<Organization> {
    req.parsed.search.$and = [
      ...req.parsed.search.$and,
      { organizationId: xReq.tokenData.organizationId },
    ];
    dto.id = xReq.tokenData.organizationId;
    return this.base.updateOneBase(req, dto);
  }

  @Permit({
    resource: Resources.Organization,
    action: 'delete',
    possession: 'any',
  })
  @Override()
  deleteOne(@ParsedRequest() req: CrudRequest): Promise<void | Organization> {
    return this.base.deleteOneBase(req);
  }
}
