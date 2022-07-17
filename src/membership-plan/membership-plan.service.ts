import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CommonField } from 'src/common-field/entities/common-field.entity';
import { MemberCommonField } from 'src/member-common-field/entities/member-common-field.entity';
import {
  PaginateConfig,
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'src/paginator';
import { Repository } from 'typeorm';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { MembershipPlan } from './entities/membership-plan.entity';

@Injectable()
export class MembershipPlanService {
  logger = new Logger(MembershipPlanService.name);
  constructor(
    @InjectRepository(MembershipPlan)
    private repo: Repository<MembershipPlan>,
  ) {}

  organizationId: number;

  find = this.repo.find;
  findOne = this.repo.findOne;
  create = this.repo.create;

  config(organizationId: number): PaginateConfig<MembershipPlan> {
    return {
      relations: ['organization'],
      sortableColumns: [
        'id',
        'name',
        'description',
        'membershipFee',
        'paymentMethod',
        'isPublic',
        'memberCanChangeTo',
        'renewalDuration',
        'renewalDurationCount',
        'approveApplication',
      ],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        organizationId: [FilterOperator.EQ],
        isPublic: [FilterOperator.EQ],
        publishedAt: [
          FilterOperator.EQ,
          FilterOperator.NULL,
          FilterOperator.BTW,
        ],
      },
      maxLimit: 100,
      defaultLimit: 50,
      where: { organizationId },
    };
  }

  getMany(query?: PaginateQuery): Promise<Paginated<MembershipPlan>> {
    return paginate(query, this.repo, this.config(this.organizationId));
    // return this.repo.find({
    //   where: { organizationId: this.organizationId },
    // });
  }

  getOne(id: number) {
    return this.repo.findOne({
      where: { id, organizationId: this.organizationId },
      relations: ['organization'],
    });
  }

  createOne(dto: CreateMembershipPlanDto): Promise<MembershipPlan> {
    dto.organizationId = this.organizationId;
    return this.repo.save(dto);
  }

  createMany(bulkDto: CreateMembershipPlanDto[]): Promise<MembershipPlan[]> {
    return this.repo.save(
      bulkDto.map((dto) => ({
        ...dto,
        organizationId: this.organizationId,
      })),
    );
  }

  async updateOne(
    id: number,
    dto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlan> {
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

  async getFormFields(): Promise<CommonField[]> {
    return CommonField.find({ where: { organizationId: this.organizationId } });
  }

  async saveFormValue(
    id: number,
    dto: Partial<MemberCommonField>[],
  ): Promise<any> {
    const bulkDto: Partial<MemberCommonField>[] = dto.map((d) => ({
      ...d,
      organizationId: this.organizationId,
    }));
    const otherFields = MemberCommonField.save(bulkDto, {
      chunk: 50,
    });

    // create user&member with password and everything;
  }
}
