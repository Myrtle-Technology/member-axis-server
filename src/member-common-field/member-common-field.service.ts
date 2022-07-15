import { Injectable } from '@nestjs/common';
import { CreateMemberCommonFieldDto } from './dto/create-member-common-field.dto';
import { UpdateMemberCommonFieldDto } from './dto/update-member-common-field.dto';

@Injectable()
export class MemberCommonFieldService {
  create(createMemberCommonFieldDto: CreateMemberCommonFieldDto) {
    return 'This action adds a new memberCommonField';
  }

  findAll() {
    return `This action returns all memberCommonField`;
  }

  findOne(id: number) {
    return `This action returns a #${id} memberCommonField`;
  }

  update(id: number, updateMemberCommonFieldDto: UpdateMemberCommonFieldDto) {
    return `This action updates a #${id} memberCommonField`;
  }

  remove(id: number) {
    return `This action removes a #${id} memberCommonField`;
  }
}
