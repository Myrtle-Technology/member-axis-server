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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import { Paginate, PaginateQuery } from 'src/paginator';
import { PaginateQueryOptions } from 'src/paginator/paginate-query-options.decorator';
import { Permit } from 'src/role/decorators/permit.decorator';
import { Resources } from 'src/role/enums/resources.enum';
import { CommonFieldService } from './common-field.service';
import { CreateCommonFieldDto } from './dto/create-common-field.dto';
import { UpdateCommonFieldDto } from './dto/update-common-field.dto';
import { CommonField } from './entities/common-field.entity';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('common-fields')
@Controller('common-fields')
export class CommonFieldController {
  constructor(private readonly service: CommonFieldService) {}

  @Get()
  @PaginateQueryOptions()
  @Permit({
    resource: Resources.CommonField,
    action: 'read',
    possession: 'own',
  })
  getMany(@Request() request: TokenRequest, @Paginate() query: PaginateQuery) {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.getMany(query);
  }
  @Get(':id')
  @Permit({
    resource: Resources.CommonField,
    action: 'read',
    possession: 'own',
  })
  getOne(@Request() request: TokenRequest, @Param('id') id: number) {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.getOne(+id);
  }

  @Post()
  @Permit({
    resource: Resources.CommonField,
    action: 'create',
    possession: 'own',
  })
  createOne(
    @Request() request: TokenRequest,
    @Body() dto: CreateCommonFieldDto,
  ): Promise<CommonField> {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.createOne(dto);
  }

  @Post('bulk')
  @Permit({
    resource: Resources.CommonField,
    action: 'create',
    possession: 'own',
  })
  createMany(
    @Request() request: TokenRequest,
    @Body() dto: CreateCommonFieldDto[],
  ): Promise<CommonField[]> {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.createMany(dto);
  }

  @Patch(':id')
  @Permit({
    resource: Resources.CommonField,
    action: 'update',
    possession: 'own',
  })
  updateOne(
    @Request() request: TokenRequest,
    @Param('id') id: number,
    @Body() dto: UpdateCommonFieldDto,
  ): Promise<CommonField> {
    this.service.organizationId = request.tokenData.organizationId;
    return this.service.updateOne(id, dto);
  }

  @Delete(':id')
  @Permit({
    resource: Resources.CommonField,
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
