import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { unionBy } from 'lodash';
import { SharedService } from 'src/shared/shared.service';
import { Repository } from 'typeorm';
import { CreateCommonFieldDto } from './dto/create-common-field.dto';
import { UpdateCommonFieldDto } from './dto/update-common-field.dto';
import { CommonField } from './entities/common-field.entity';
import { CommonFieldType } from './enums/common-field-type.enum';

@Injectable()
export class CommonFieldService extends SharedService<CommonField> {
  logger = new Logger(CommonFieldService.name);
  constructor(@InjectRepository(CommonField) repo: Repository<CommonField>) {
    super(repo);
  }

  organizationId: number;

  public defaultFields = [
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
      name: 'username',
      type: CommonFieldType.text,
      required: true,
      label: 'Email or Phone Number',
      order: 2,
    }),
    new CommonField({
      name: 'password',
      type: CommonFieldType.password,
      required: false,
      label: 'Password',
      order: 3,
    }),
  ];

  async getMany(): Promise<CommonField[]> {
    return unionBy(
      [
        ...this.defaultFields,
        ...(await this.repo.find({
          where: { organizationId: this.organizationId },
        })),
      ],
      'name',
    ).sort((a, b) => a.order - b.order);
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
