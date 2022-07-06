import { IsString, IsEmail, IsPhoneNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName?: string;
  @IsString()
  lastName?: string;
  @IsEmail()
  email?: string;
  @IsPhoneNumber()
  phone?: string;
}
