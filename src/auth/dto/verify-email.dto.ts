import { IsUserName } from '../decorators/is-username.decorator';

export class VerifyEmailDto {
  @IsUserName()
  username: string;
}
