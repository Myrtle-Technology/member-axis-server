import {
  CommonFieldOption,
  CommonFieldPrivacy,
} from '../entities/common-field.entity';
import { CommonFieldType } from '../enums/common-field-type.enum';

export class CreateCommonFieldDto {
  id: number;
  name: string;
  label: string;
  type: CommonFieldType;
  options: CommonFieldOption[];
  required: boolean;
  order: number;
  formId: number;
  organizationId: number;
  privacy: CommonFieldPrivacy;
}
