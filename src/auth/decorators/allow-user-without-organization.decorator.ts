import { SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const USER_WITHOUT_ORGANIZATION = 'UserWithoutOrganization';
export const AllowUserWithoutOrganization = () => {
  SetMetadata(USER_WITHOUT_ORGANIZATION, true);
  return ApiBearerAuth();
};
