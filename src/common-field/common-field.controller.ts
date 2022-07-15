import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CommonFieldService } from './common-field.service';
import { CreateCommonFieldDto } from './dto/create-common-field.dto';
import { UpdateCommonFieldDto } from './dto/update-common-field.dto';

@Controller('common-field')
export class CommonFieldController {
  constructor(private readonly commonFieldService: CommonFieldService) {}

  @Post()
  create(@Body() createCommonFieldDto: CreateCommonFieldDto) {
    return this.commonFieldService.create(createCommonFieldDto);
  }

  @Get()
  findAll() {
    return this.commonFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commonFieldService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCommonFieldDto: UpdateCommonFieldDto) {
    return this.commonFieldService.update(+id, updateCommonFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.commonFieldService.remove(+id);
  }
}
