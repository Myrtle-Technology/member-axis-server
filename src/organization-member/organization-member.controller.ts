import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Request,
} from '@nestjs/common';
import { OrganizationMemberService } from './organization-member.service';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMember } from './entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { Permit } from 'src/role/decorators/permit.decorator';
import { Paginate, PaginateQuery } from 'src/shared/paginator';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { Resources } from 'src/role/enums/resources.enum';
import { PaginateQueryOptions } from 'src/shared/paginator/paginate-query-options.decorator';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('members')
@Controller('members')
export class OrganizationMemberController {
  constructor(public service: OrganizationMemberService) {}

  @Get()
  @PaginateQueryOptions()
  @Permit({
    resource: Resources.OrganizationMember,
    action: 'read',
    possession: 'own',
  })
  getMany(@Request() request: TokenRequest, @Paginate() query: PaginateQuery) {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.getMany(query);
  }
  @Get(':id')
  @Permit({
    resource: Resources.OrganizationMember,
    action: 'read',
    possession: 'own',
  })
  getOne(@Request() request: TokenRequest, @Param('id') id: number) {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.getOne(+id);
  }

  @Post()
  @Permit({
    resource: Resources.OrganizationMember,
    action: 'create',
    possession: 'own',
  })
  createOne(
    @Request() request: TokenRequest,
    @Body() dto: CreateOrganizationMemberDto,
  ): Promise<OrganizationMember> {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.createOne(dto);
  }

  @Post('bulk')
  @Permit({
    resource: Resources.OrganizationMember,
    action: 'create',
    possession: 'own',
  })
  createMany(
    @Request() request: TokenRequest,
    @Body() dto: CreateOrganizationMemberDto[],
  ): Promise<OrganizationMember[]> {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.createMany(dto);
  }

  @Patch(':id')
  @Permit({
    resource: Resources.OrganizationMember,
    action: 'update',
    possession: 'own',
  })
  updateOne(
    @Request() request: TokenRequest,
    @Param('id') id: number,
    @Body() dto: UpdateOrganizationMemberDto,
  ): Promise<OrganizationMember> {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.updateOne(id, dto);
  }

  @Delete(':id')
  @Permit({
    resource: Resources.OrganizationMember,
    action: 'delete',
    possession: 'own',
  })
  async deleteOne(
    @Request() request: TokenRequest,
    @Param('id') id: number,
  ): Promise<{ deleted: boolean }> {
    this.service.organizationId = request.tokenData.organizationId;
    const deleted = await this.service.deleteOne(+id);
    return { deleted };
  }
}
