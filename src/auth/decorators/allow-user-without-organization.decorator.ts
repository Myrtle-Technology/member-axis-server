import { SetMetadata } from '@nestjs/common';

export const USER_WITHOUT_ORGANIZATION = 'UserWithoutOrganization';
export const AllowUserWithoutOrganization = () =>
  SetMetadata(USER_WITHOUT_ORGANIZATION, true);
