import {
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';
import { MemberCommonField } from 'src/member-common-field/entities/member-common-field.entity';

export class CreateOrganizationMemberDto {
  @Min(1)
  @IsInt()
  userId: number;

  @Min(1)
  @IsInt()
  organizationId: number;

  @Min(1)
  @IsInt()
  roleId: number;

  @IsString()
  bio?: string;

  @IsPhoneNumber()
  contactPhone?: string;

  @IsString()
  officeTitle?: string;

  @IsString()
  password?: string;

  @IsOptional()
  commonFields?: MemberCommonField[];
}
