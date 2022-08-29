import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginateConfig,
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'src/shared/paginator';
import { Repository, In } from 'typeorm';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { MembershipPlan } from './entities/membership-plan.entity';
import { SharedService } from 'src/shared/shared.service';
import { MemberCommonFieldService } from 'src/member-common-field/member-common-field.service';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { MembershipPlanCreated } from './events/membership-plan-created.event';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class MembershipPlanService extends SharedService<MembershipPlan> {
  logger = new Logger(MembershipPlanService.name);
  constructor(
    @InjectRepository(MembershipPlan)
    public repo: Repository<MembershipPlan>,
    private memberCommonFieldService: MemberCommonFieldService,
    private eventEmitter: EventEmitter2,
  ) {
    super(repo);
  }

  public organizationId: number;
  config(organizationId: number): PaginateConfig<MembershipPlan> {
    return {
      relations: ['changeableTo'],
      sortableColumns: [
        'id',
        'name',
        'description',
        'membershipFee',
        'paymentMethod',
        'isPublic',
        // 'memberCanChangeTo',
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
      relations: ['organization', 'changeableTo'],
    });
  }

  async createOne(dto: CreateMembershipPlanDto): Promise<MembershipPlan> {
    dto.organizationId = this.organizationId;
    const plansMemberCanChangeTo = await this.repo.find({
      where: { id: In(dto.memberCanChangeTo) },
    });
    delete dto.memberCanChangeTo;
    const nDto: Omit<CreateMembershipPlanDto, 'memberCanChangeTo'> = dto;
    const currentPlan = await this.repo.save({
      ...nDto,
      changeableTo: plansMemberCanChangeTo,
    });
    this.eventEmitter.emit(
      MembershipPlanCreated.eventName,
      new MembershipPlanCreated(currentPlan),
    );
    return currentPlan;
  }

  @OnEvent(MembershipPlanCreated.eventName, { async: true })
  async handleMembershipPlanCreatedEvent(payload: MembershipPlanCreated) {
    // handle and process "MembershipPlanCreated" event
    // set up reminders for the new plan
  }

  async updateOne(
    id: number,
    dto: UpdateMembershipPlanDto,
  ): Promise<MembershipPlan> {
    const currentPlan = await this.repo.findOne({
      id,
      organizationId: this.organizationId,
    });
    if (!currentPlan) {
      throw new NotFoundException(
        'The specified membership level was not found',
      );
    }

    const plansMemberCanChangeTo = await this.repo.find({
      where: { id: In(dto.memberCanChangeTo) },
    });
    delete dto.memberCanChangeTo;
    const nDto: Omit<UpdateMembershipPlanDto, 'memberCanChangeTo'> = dto;
    // update current plan
    await this.repo.update(
      { id: currentPlan.id, organizationId: this.organizationId },
      { ...nDto, changeableTo: plansMemberCanChangeTo },
    );
    await currentPlan.reload();
    return currentPlan;
  }

  async deleteOne(id: number): Promise<boolean> {
    await this.repo.delete({
      id,
      organizationId: this.organizationId,
    });
    return true;
  }
}
