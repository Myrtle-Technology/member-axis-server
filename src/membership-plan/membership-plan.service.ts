import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CommonField,
  CommonFieldType,
} from 'src/common-field/entities/common-field.entity';
import { MemberCommonField } from 'src/member-common-field/entities/member-common-field.entity';
import { OrganizationMember } from 'src/organization-member/entities';
import * as bcrypt from 'bcrypt';
import {
  PaginateConfig,
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'src/paginator';
import { User } from 'src/user/entities';
import { Repository } from 'typeorm';
import { CreateMembershipPlanDto } from './dto/create-membership-plan.dto';
import { UpdateMembershipPlanDto } from './dto/update-membership-plan.dto';
import { MembershipPlan } from './entities/membership-plan.entity';
import { ConfigService } from '@nestjs/config';
import { unionBy } from 'lodash';

@Injectable()
export class MembershipPlanService {
  logger = new Logger(MembershipPlanService.name);
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    @InjectRepository(MembershipPlan)
    private repo: Repository<MembershipPlan>,
    private configService: ConfigService,
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
    const fields = [
      new CommonField({
        name: 'firstName',
        type: CommonFieldType.text,
        required: true,
        label: 'First Name',
        order: 0,
      }),
      new CommonField({
        name: 'lastName',
        type: CommonFieldType.text,
        required: true,
        label: 'Last Name',
        order: 1,
      }),
      new CommonField({
        name: 'phone',
        type: CommonFieldType.text,
        required: true,
        label: 'phone',
        order: 2,
      }),
      new CommonField({
        name: 'email',
        type: CommonFieldType.text,
        required: false,
        label: 'Email',
        order: 3,
      }),
      new CommonField({
        name: 'password',
        type: CommonFieldType.password,
        required: false,
        label: 'Password',
        order: 3,
      }),
    ];
    return unionBy(
      [
        ...fields,
        ...(await CommonField.find({
          where: { organizationId: this.organizationId },
          order: { order: 'ASC' },
        })),
      ],
      'name',
    ).sort((a, b) => a.order - b.order);
  }

  async saveFormValue(
    id: number,
    dto: MemberCommonField[],
  ): Promise<OrganizationMember> {
    const membershipPlan = await this.repo.findOne(id);
    if (!membershipPlan) {
      throw new BadRequestException('Membership plan not found');
    }

    const defaultFields = dto.filter((d) => !d.id);

    const user = await new User({
      firstName: defaultFields.find((d) => d.commonField.name === 'firstName')
        ?.value,
      lastName: defaultFields.find((d) => d.commonField.name === 'lastName')
        ?.value,
      email: defaultFields.find((d) => d.commonField.name === 'email')?.value,
      phone: defaultFields.find((d) => d.commonField.name === 'phone')?.value,
    }).save();

    const organizationMember = await new OrganizationMember({
      userId: user.id,
      organizationId: this.organizationId,
      password: await bcrypt.hash(
        defaultFields.find((d) => d.commonField.name === 'password')?.value,
        this.saltRounds,
      ),
    }).save();

    const commonFields = dto.filter((d) => d.id);
    const bulkDto: MemberCommonField[] = commonFields.map(
      (d) =>
        new MemberCommonField({
          ...d,
          organizationMemberId: organizationMember.id,
          organizationId: this.organizationId,
        }),
    );

    await MemberCommonField.save(bulkDto, {
      chunk: 50,
    });
    await organizationMember.reload();
    return organizationMember;
  }
}
