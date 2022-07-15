import { Module } from '@nestjs/common';
import { CommonFieldService } from './common-field.service';
import { CommonFieldController } from './common-field.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonField } from './entities/common-field.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CommonField])],
  controllers: [CommonFieldController],
  providers: [CommonFieldService],
  exports: [CommonFieldService, TypeOrmModule.forFeature([CommonField])],
})
export class CommonFieldModule {}
