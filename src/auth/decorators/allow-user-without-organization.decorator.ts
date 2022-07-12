import { applyDecorators, SetMetadata } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

export const USER_WITHOUT_ORGANIZATION = 'UserWithoutOrganization';
export const AllowUserWithoutOrganization = () => {
  return applyDecorators(
    SetMetadata(USER_WITHOUT_ORGANIZATION, true),
    ApiBearerAuth(),
  );
};
