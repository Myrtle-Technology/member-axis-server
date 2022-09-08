import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  FilterOperator,
  paginate,
  PaginateConfig,
  Paginated,
  PaginateQuery,
} from 'src/shared/paginator';
import { SharedService } from 'src/shared/shared.service';
import { Repository } from 'typeorm';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Subscription } from './entities/subscription.entity';

@Injectable()
export class SubscriptionService extends SharedService<Subscription> {
  constructor(
    @InjectRepository(Subscription)
    repo: Repository<Subscription>,
  ) {
    super(repo);
  }

  public organizationId: number;

  config(organizationId: number): PaginateConfig<Subscription> {
    return {
      relations: ['member', 'membershipPlan'],
      sortableColumns: [
        'id',
        'organizationId',
        'membershipPlanId',
        'memberId',
        'member.user.firstName',
        'member.user.lastName',
      ],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        memberId: [FilterOperator.EQ],
        membershipPlanId: [FilterOperator.EQ],
      },
      maxLimit: 100,
      defaultLimit: 50,
      where: { organizationId },
    };
  }

  getMany(query?: PaginateQuery): Promise<Paginated<Subscription>> {
    return paginate(query, this.repo, this.config(this.organizationId));
  }

  getOne(id: number) {
    return this.repo.findOne({
      where: { id, organizationId: this.organizationId },
      relations: ['organization'],
    });
  }

  async createOne(dto: CreateSubscriptionDto): Promise<Subscription> {
    dto.organizationId = dto.organizationId || this.organizationId;
    return this.repo.save(dto);
  }

  createMany(bulkDto: CreateSubscriptionDto[]): Promise<Subscription[]> {
    return this.repo.save(
      bulkDto.map((dto) => ({
        ...dto,
        organizationId: this.organizationId,
      })),
      {
        chunk: 50,
      },
    );
  }

  async updateOne(
    id: number,
    dto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
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
