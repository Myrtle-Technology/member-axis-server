import { IsString, IsOptional, MaxLength, MinLength } from 'class-validator';
import { MemberCommonField } from 'src/member-common-field/entities/member-common-field.entity';
import { IsUsername } from '../decorators/is-username.decorator';

export class RegisterOrganizationMember {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsUsername()
  username: string;

  @MinLength(6)
  @MaxLength(20)
  password: string;
  membershipPlanId: number;
  commonFields: MemberCommonField[];
}
