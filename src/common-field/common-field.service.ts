import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  PaginateConfig,
  FilterOperator,
  PaginateQuery,
  Paginated,
  paginate,
} from 'src/paginator';
import { SharedService } from 'src/shared/shared.service';
import { Repository } from 'typeorm';
import { CreateCommonFieldDto } from './dto/create-common-field.dto';
import { UpdateCommonFieldDto } from './dto/update-common-field.dto';
import { CommonField } from './entities/common-field.entity';

@Injectable()
export class CommonFieldService extends SharedService<CommonField> {
  logger = new Logger(CommonFieldService.name);
  constructor(@InjectRepository(CommonField) repo: Repository<CommonField>) {
    super(repo);
  }

  organizationId: number;

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
    return this.repo.save(new CommonField(dto));
  }

  createMany(dto: CreateCommonFieldDto[]): Promise<CommonField[]> {
    const bulkDto = dto.map(
      (dto) =>
        new CommonField({
          ...dto,
          organizationId: this.organizationId,
        }),
    );
    return this.repo.save(bulkDto);
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
