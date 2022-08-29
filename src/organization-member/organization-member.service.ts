import { Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { InvitationService } from 'src/invitation/invitation.service';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'src/shared/paginator';
import { SharedService } from 'src/shared/shared.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import { Repository } from 'typeorm';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMember } from './entities';

export class OrganizationMemberService extends SharedService<OrganizationMember> {
  logger = new Logger(OrganizationMemberService.name);
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    @InjectRepository(OrganizationMember)
    repo: Repository<OrganizationMember>,
    private configService: ConfigService,
    private subscriptionService: SubscriptionService,
    private invitationService: InvitationService,
  ) {
    super(repo);
  }

  organizationId: number;

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
      select: [
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
    });
  }

  async createOne(
    dto: CreateOrganizationMemberDto,
  ): Promise<OrganizationMember> {
    dto.organizationId = dto.organizationId || this.organizationId;
    if (dto.password) {
      dto.password = await bcrypt.hash(dto.password, this.saltRounds);
    }
    return this.repo.save(dto);
  }

  async createMany(
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
    const member = await this.repo.findOne(id);
    if (!member) {
      throw new NotFoundException('The specified member was not found');
    }
    await this.repo.update(
      { id: member.id, organizationId: this.organizationId },
      dto,
    );
    await member.reload();
    return member;
  }

  async deleteOne(id: number): Promise<boolean> {
    await this.repo.delete({
      id,
      organizationId: this.organizationId,
    });
    return true;
  }

  async inviteMember() {
    // create a new user
    // create new subscription to a membership plan
    // get member Role
    // create a member without password
    // create invitation
    // send member an invite email
  }
}
