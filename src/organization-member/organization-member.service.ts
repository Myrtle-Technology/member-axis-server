import { Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

export class OrganizationMemberService {
  logger = new Logger(OrganizationMemberService.name);
  constructor(
    @InjectRepository(OrganizationMember)
    private repo: Repository<OrganizationMember>,
  ) {}

  organizationId: number;

  find = this.repo.find;
  findOne = this.repo.findOne;
  create = this.repo.create;

  config(organizationId: number): PaginateConfig<OrganizationMember> {
    return {
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
      where: { organizationId },
    };
  }

  getMany(query?: PaginateQuery): Promise<Paginated<OrganizationMember>> {
    return paginate(query, this.repo, this.config(this.organizationId));
    // return this.repo.find({
    //   where: { organizationId: this.organizationId },
    // });
  }

  getOne(id: number) {
    return this.repo.findOne({
      where: { id, organizationId: this.organizationId },
      relations: ['role', 'organization', 'user'],
    });
  }

  createOne(dto: CreateOrganizationMemberDto): Promise<OrganizationMember> {
    dto.organizationId = this.organizationId;
    // TODO: password hash or invite user
    return this.repo.save(dto);
  }

  createMany(
    bulkDto: CreateOrganizationMemberDto[],
  ): Promise<OrganizationMember[]> {
    return this.repo.save(
      bulkDto.map((dto) => ({
        ...dto,
        organizationId: this.organizationId,
      })),
    );
  }

  async updateOne(
    id: number,
    dto: UpdateOrganizationMemberDto,
  ): Promise<OrganizationMember> {
    await this.repo.update({ id, organizationId: this.organizationId }, dto);
    return this.repo.findOne(id);
  }
  async deleteOne(id: number): Promise<boolean> {
    await this.repo.delete({
      id,
      organizationId: this.organizationId,
    });
    return true;
  }
}
