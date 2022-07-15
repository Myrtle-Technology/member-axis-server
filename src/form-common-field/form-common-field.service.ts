import { Injectable } from '@nestjs/common';
import { CreateFormCommonFieldDto } from './dto/create-form-common-field.dto';
import { UpdateFormCommonFieldDto } from './dto/update-form-common-field.dto';

@Injectable()
export class FormCommonFieldService {
  create(createFormCommonFieldDto: CreateFormCommonFieldDto) {
    return 'This action adds a new formCommonField';
  }

  findAll() {
    return `This action returns all formCommonField`;
  }

  findOne(id: number) {
    return `This action returns a #${id} formCommonField`;
  }

  update(id: number, updateFormCommonFieldDto: UpdateFormCommonFieldDto) {
    return `This action updates a #${id} formCommonField`;
  }

  remove(id: number) {
    return `This action removes a #${id} formCommonField`;
  }
}
