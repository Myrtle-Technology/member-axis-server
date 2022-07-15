import { Module } from '@nestjs/common';
import { FormCommonFieldService } from './form-common-field.service';
import { FormCommonFieldController } from './form-common-field.controller';

@Module({
  controllers: [FormCommonFieldController],
  providers: [FormCommonFieldService]
})
export class FormCommonFieldModule {}
