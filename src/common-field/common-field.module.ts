import { Module } from '@nestjs/common';
import { CommonFieldService } from './common-field.service';
import { CommonFieldController } from './common-field.controller';

@Module({
  controllers: [CommonFieldController],
  providers: [CommonFieldService]
})
export class CommonFieldModule {}
