import { Inject, Injectable, Logger, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'src/paginator';
import { Repository } from 'typeorm';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMember } from './entities';

@Injectable({ scope: Scope.REQUEST })
export class OrganizationMemberService {
  logger = new Logger(OrganizationMemberService.name);
  constructor(
    @Inject(REQUEST) private request: TokenRequest,
    @InjectRepository(OrganizationMember)
    private repo: Repository<OrganizationMember>,
  ) {}

  organizationId() {
    return this.request.tokenData.organizationId;
  }

  find = this.repo.find;
  findOne = this.repo.findOne;
  create = this.repo.create;

  config: PaginateConfig<OrganizationMember> = {
    relations: ['organization', 'user', 'role'],
    sortableColumns: [
      'id',
      'organizationId',
      'organization',
      'userId',
      'user',
      'roleId',
      'role',
      'bio',
      'contactPhone',
      'officeTitle',
      'createdAt',
      'updatedAt',
    ],
    defaultSortBy: [['id', 'DESC']],
    filterableColumns: {
      organizationId: [FilterOperator.EQ],
      userId: [FilterOperator.EQ],
      roleId: [FilterOperator.EQ, FilterOperator.NOT],
    },
    maxLimit: 100,
    defaultLimit: 50,
    where: { organizationId: this.organizationId },
  };

  getMany(query?: PaginateQuery): Promise<Paginated<OrganizationMember>> {
    return paginate(query, this.repo, this.config);
  }

  getOne(id: number) {
    return this.repo.findOne({
      where: { id, organizationId: this.organizationId },
    });
  }

  createOne(dto: CreateOrganizationMemberDto): Promise<OrganizationMember> {
    dto.organizationId = this.organizationId();
    // TODO: password hash or invite user
    return this.repo.save(dto);
  }

  createMany(
    bulkDto: CreateOrganizationMemberDto[],
  ): Promise<OrganizationMember[]> {
    return this.repo.save(
      bulkDto.map((dto) => ({ ...dto, organizationId: this.organizationId() })),
    );
  }

  async updateOne(
    id: number,
    dto: UpdateOrganizationMemberDto,
  ): Promise<OrganizationMember> {
    await this.repo.update({ id, organizationId: this.organizationId() }, dto);
    return this.repo.findOne(id);
  }
  async deleteOne(id: number): Promise<boolean> {
    await this.repo.delete({ id, organizationId: this.organizationId() });
    return true;
  }
}
