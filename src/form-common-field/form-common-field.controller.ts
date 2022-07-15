import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FormCommonFieldService } from './form-common-field.service';
import { CreateFormCommonFieldDto } from './dto/create-form-common-field.dto';
import { UpdateFormCommonFieldDto } from './dto/update-form-common-field.dto';

@Controller('form-common-field')
export class FormCommonFieldController {
  constructor(private readonly formCommonFieldService: FormCommonFieldService) {}

  @Post()
  create(@Body() createFormCommonFieldDto: CreateFormCommonFieldDto) {
    return this.formCommonFieldService.create(createFormCommonFieldDto);
  }

  @Get()
  findAll() {
    return this.formCommonFieldService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.formCommonFieldService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFormCommonFieldDto: UpdateFormCommonFieldDto) {
    return this.formCommonFieldService.update(+id, updateFormCommonFieldDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.formCommonFieldService.remove(+id);
  }
}
