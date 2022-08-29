import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginateConfig,
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'src/shared/paginator';
import { SharedService } from 'src/shared/shared.service';
import { Repository } from 'typeorm';
import { CreateMemberCommonFieldDto } from './dto/create-member-common-field.dto';
import { UpdateMemberCommonFieldDto } from './dto/update-member-common-field.dto';
import { MemberCommonField } from './entities/member-common-field.entity';

@Injectable()
export class MemberCommonFieldService extends SharedService<MemberCommonField> {
  constructor(
    @InjectRepository(MemberCommonField)
    repo: Repository<MemberCommonField>,
  ) {
    super(repo);
  }

  public organizationId: number;

  config(organizationId: number): PaginateConfig<MemberCommonField> {
    return {
      relations: ['organization'],
      sortableColumns: [
        'id',
        'organizationId',
        'organizationMemberId',
        'organizationMember.user.firstName',
      ],
      defaultSortBy: [['id', 'DESC']],
      filterableColumns: {
        organizationId: [FilterOperator.EQ],
      },
      maxLimit: 100,
      defaultLimit: 50,
      where: { organizationId },
    };
  }

  getMany(query?: PaginateQuery): Promise<Paginated<MemberCommonField>> {
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

  async createOne(dto: CreateMemberCommonFieldDto): Promise<MemberCommonField> {
    dto.organizationId = dto.organizationId || this.organizationId;
    return this.repo.save(dto);
  }

  createMany(
    bulkDto: CreateMemberCommonFieldDto[],
  ): Promise<MemberCommonField[]> {
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
    dto: UpdateMemberCommonFieldDto,
  ): Promise<MemberCommonField> {
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
