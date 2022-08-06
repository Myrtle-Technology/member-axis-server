import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { MemberCommonFieldService } from './member-common-field.service';
import { CreateMemberCommonFieldDto } from './dto/create-member-common-field.dto';
import { UpdateMemberCommonFieldDto } from './dto/update-member-common-field.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('member-common-field')
@Controller('member-common-field')
export class MemberCommonFieldController {
  constructor(
    private readonly memberCommonFieldService: MemberCommonFieldService,
  ) {}

  @Post()
  create(@Body() createMemberCommonFieldDto: CreateMemberCommonFieldDto) {
    return this.memberCommonFieldService.create(createMemberCommonFieldDto);
  }

  @Get()
  findAll() {
    return this.memberCommonFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.memberCommonFieldService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateMemberCommonFieldDto: UpdateMemberCommonFieldDto,
  ) {
    return this.memberCommonFieldService.update(
      +id,
      updateMemberCommonFieldDto,
    );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.memberCommonFieldService.remove(+id);
  }
}
