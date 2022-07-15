import { CommonFieldType } from '../entities/common-field.entity';

export class CreateCommonFieldDto {
  id: number;
  name: string;
  label: string;
  type: CommonFieldType;
  options: string[];
  required: boolean;
  order: number;
  organizationId: number;
}
