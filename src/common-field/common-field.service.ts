import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginateConfig,
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'src/paginator';
import { Repository } from 'typeorm';
import { CreateCommonFieldDto } from './dto/create-common-field.dto';
import { UpdateCommonFieldDto } from './dto/update-common-field.dto';
import { CommonField } from './entities/common-field.entity';

@Injectable()
export class CommonFieldService {
  logger = new Logger(CommonFieldService.name);
  constructor(
    @InjectRepository(CommonField)
    private repo: Repository<CommonField>,
  ) {}

  organizationId: number;

  find = this.repo.find;
  findOne = this.repo.findOne;
  create = this.repo.create;

  config(organizationId: number): PaginateConfig<CommonField> {
    return {
      relations: ['organization'],
      sortableColumns: [
        'id',
        'name',
        'label',
        'type',
        'options',
        'required',
        'members',
        'order',
        'organizationId',
        'organization',
      ],
      defaultSortBy: [
        ['order', 'ASC'],
        ['id', 'DESC'],
      ],
      filterableColumns: {
        organizationId: [FilterOperator.EQ],
        order: [FilterOperator.EQ],
        'members.id': [FilterOperator.EQ],
      },
      maxLimit: 100,
      defaultLimit: 50,
      where: { organizationId },
    };
  }

  getMany(query?: PaginateQuery): Promise<Paginated<CommonField>> {
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

  createOne(dto: CreateCommonFieldDto): Promise<CommonField> {
    dto.organizationId = this.organizationId;
    return this.repo.save(dto);
  }

  createMany(bulkDto: CreateCommonFieldDto[]): Promise<CommonField[]> {
    return this.repo.save(
      bulkDto.map((dto) => ({
        ...dto,
        organizationId: this.organizationId,
      })),
    );
  }

  async updateOne(id: number, dto: UpdateCommonFieldDto): Promise<CommonField> {
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
