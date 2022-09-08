import { Exclude } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateMemberCommonFieldDto {
  @Exclude()
  organizationId: number;

  @Exclude()
  memberId: number;

  @IsInt()
  commonFieldId: number;
  value: any;
}
