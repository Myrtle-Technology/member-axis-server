import { IsUserName } from '../decorators/is-username.decorator';

export class FindUserOrganization {
  @IsUserName()
  username: string;
}
