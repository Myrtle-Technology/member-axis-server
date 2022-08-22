import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';
import { unionBy } from 'lodash';
import { CommonFieldService } from 'src/common-field/common-field.service';
import { CommonField } from 'src/common-field/entities/common-field.entity';
import { CommonFieldType } from 'src/common-field/enums/common-field-type.enum';
import { MemberCommonFieldService } from 'src/member-common-field/member-common-field.service';
import { MembershipPlanService } from 'src/membership-plan/membership-plan.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities';

@Injectable()
export class OrganizationService extends TypeOrmCrudService<Organization> {
  logger = new Logger(OrganizationService.name);
  constructor(
    @InjectRepository(Organization) repo,
    public memberCommonFieldService: MemberCommonFieldService,
    public commonFieldService: CommonFieldService,
    public membershipPlanService: MembershipPlanService,
  ) {
    super(repo);
  }

  public organizationId: number;

  async getOrganizationBySlug(organizationSlug: string) {
    return this.repo.findOne({ where: { slug: organizationSlug } });
  }

  async update(organizationId: number, dto: UpdateOrganizationDto) {
    this.repo.update(organizationId, dto);
    return this.repo.findOne(organizationId);
  }

  async create(dto: CreateOrganizationDto) {
    return this.repo.save(dto);
  }

  async getRegistrationFormFields(): Promise<CommonField[]> {
    const membershipPlans = await this.membershipPlanService.find({
      organizationId: this.organizationId,
    });
    return unionBy(
      [
        ...this.commonFieldService.defaultFields,
        new CommonField({
          name: 'membershipPlanId',
          type: CommonFieldType.number,
          required: false,
          label: 'Membership Plan',
          order: -1,
          options: membershipPlans.map((p) => ({
            label: p.name,
            value: p.id,
          })),
        }),
        ...(await CommonField.find({
          where: { organizationId: this.organizationId },
          order: { order: 'ASC' },
        })),
      ],
      'name',
    ).sort((a, b) => a.order - b.order);
  }
}
