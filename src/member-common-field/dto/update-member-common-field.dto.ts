import { PartialType } from '@nestjs/swagger';
import { CreateMemberCommonFieldDto } from './create-member-common-field.dto';

export class UpdateMemberCommonFieldDto extends PartialType(CreateMemberCommonFieldDto) {}
