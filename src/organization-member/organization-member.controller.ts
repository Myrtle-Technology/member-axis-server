import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { OrganizationMemberService } from './organization-member.service';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMember } from './entities';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';
import { Permit } from 'src/role/decorators/permit.decorator';
import { Paginate, PaginateQuery } from 'src/paginator';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('members')
@Controller('members')
export class OrganizationMemberController {
  constructor(public service: OrganizationMemberService) {}

  @Get()
  // @Permit({ resource: 'members', action: 'read', possession: 'own' })
  getMany(@Paginate() query: PaginateQuery) {
    return this.service.getMany(query);
  }
  @Get(':id')
  @Permit({ resource: 'members', action: 'read', possession: 'own' })
  getOne(@Param('id') id: number) {
    return this.service.getOne(+id);
  }

  @Post()
  @Permit({ resource: 'members', action: 'create', possession: 'own' })
  createOne(
    @Body() dto: CreateOrganizationMemberDto,
  ): Promise<OrganizationMember> {
    return this.service.createOne(dto);
  }

  @Post('bulk')
  @Permit({ resource: 'members', action: 'create', possession: 'own' })
  createMany(
    @Body() dto: CreateOrganizationMemberDto[],
  ): Promise<OrganizationMember[]> {
    return this.service.createMany(dto);
  }

  @Patch(':id')
  @Permit({ resource: 'members', action: 'update', possession: 'own' })
  updateOne(
    @Param('id') id: number,
    @Body() dto: UpdateOrganizationMemberDto,
  ): Promise<OrganizationMember> {
    return this.service.updateOne(id, dto);
  }

  @Delete(':id')
  @Permit({ resource: 'members', action: 'delete', possession: 'own' })
  async deleteOne(@Param('id') id: number): Promise<{ deleted: boolean }> {
    const deleted = await this.service.deleteOne(+id);
    return { deleted };
  }
}
