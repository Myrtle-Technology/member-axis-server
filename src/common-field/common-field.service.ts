import { Injectable } from '@nestjs/common';
import { CreateCommonFieldDto } from './dto/create-common-field.dto';
import { UpdateCommonFieldDto } from './dto/update-common-field.dto';

@Injectable()
export class CommonFieldService {
  create(createCommonFieldDto: CreateCommonFieldDto) {
    return 'This action adds a new commonField';
  }

  findAll() {
    return `This action returns all commonField`;
  }

  findOne(id: number) {
    return `This action returns a #${id} commonField`;
  }

  update(id: number, updateCommonFieldDto: UpdateCommonFieldDto) {
    return `This action updates a #${id} commonField`;
  }

  remove(id: number) {
    return `This action removes a #${id} commonField`;
  }
}
