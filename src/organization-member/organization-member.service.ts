import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'src/paginator';
import { FindManyOptions, Repository, SaveOptions } from 'typeorm';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMember } from './entities';

export class OrganizationMemberService {
  logger = new Logger(OrganizationMemberService.name);
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    private configService: ConfigService,
    @InjectRepository(OrganizationMember)
    private repo: Repository<OrganizationMember>,
  ) {}

  organizationId: number;

  find(options?: FindManyOptions<OrganizationMember>) {
    return this.repo.find(options);
  }
  findOne(options?: FindManyOptions<OrganizationMember>) {
    return this.repo.findOne(options);
  }
  create(
    entities: OrganizationMember,
    options?: SaveOptions & {
      reload: false;
    },
  ) {
    return this.repo.save(entities, options);
  }

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

  async createOne(
    dto: CreateOrganizationMemberDto,
  ): Promise<OrganizationMember> {
    dto.organizationId = dto.organizationId || this.organizationId;
    dto.password = await bcrypt.hash(dto.password, this.saltRounds);
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
