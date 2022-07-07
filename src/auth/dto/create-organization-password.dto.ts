import { MinLength, MaxLength, IsString } from 'class-validator';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { IsEqualTo } from '../decorators/is-equal-to.decorator';

export class CreateOrganizationPasswordDto extends CreateOrganizationDto {
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @MinLength(6)
  @MaxLength(20)
  @IsEqualTo('password')
  confirmPassword: string;

  @IsString()
  officeTitle: string;
}
