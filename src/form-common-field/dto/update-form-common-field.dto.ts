import { PartialType } from '@nestjs/swagger';
import { CreateFormCommonFieldDto } from './create-form-common-field.dto';

export class UpdateFormCommonFieldDto extends PartialType(CreateFormCommonFieldDto) {}
