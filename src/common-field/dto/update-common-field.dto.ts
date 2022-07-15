import { PartialType } from '@nestjs/swagger';
import { CreateCommonFieldDto } from './create-common-field.dto';

export class UpdateCommonFieldDto extends PartialType(CreateCommonFieldDto) {}
