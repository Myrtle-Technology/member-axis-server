import { IsUsername } from '../decorators/is-username.decorator';

export class VerifyEmailDto {
  @IsUsername()
  username: string;
}
