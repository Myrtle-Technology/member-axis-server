import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { MembershipPlanService } from './membership-plan.service';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { Paginate, PaginateQuery } from 'src/paginator';
import { PaginateQueryOptions } from 'src/paginator/paginate-query-options.decorator';
import { Permit } from 'src/role/decorators/permit.decorator';
import { Resources } from 'src/role/enums/resources.enum';
import { MembershipPlan } from './entities/membership-plan.entity';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('membership-plans')
@Controller('membership-plans')
export class MembershipPlanController {
  constructor(private readonly service: MembershipPlanService) {}

  @Get()
  @PaginateQueryOptions()
  @Permit({
    resource: Resources.MembershipPlan,
    action: 'read',
    possession: 'own',
  })
  getMany(@Request() request: TokenRequest, @Paginate() query: PaginateQuery) {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.getMany(query);
  }

  @Get(':id')
  @Permit({
    resource: Resources.MembershipPlan,
    action: 'read',
    possession: 'own',
  })
  getOne(@Request() request: TokenRequest, @Param('id') id: number) {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.getOne(+id);
  }

  @Post()
  @Permit({
    resource: Resources.MembershipPlan,
    action: 'create',
    possession: 'own',
  })
  createOne(
    @Request() request: TokenRequest,
    @Body() dto: CreateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.createOne(dto);
  }

  @Patch(':id')
  @ApiBearerAuth()
  @Permit({
    resource: Resources.MembershipPlan,
    action: 'update',
    possession: 'own',
  })
  updateOne(
    @Request() request: TokenRequest,
    @Param('id') id: number,
    @Body() dto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.updateOne(id, dto);
  }

  @Delete(':id')
  @ApiBearerAuth()
  @Permit({
    resource: Resources.MembershipPlan,
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
