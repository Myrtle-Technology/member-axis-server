import { applyDecorators, UseGuards } from '@nestjs/common';
import { ACGuard, Role, UseRoles } from 'nest-access-control';
import { OrganizationMember } from 'src/organization-member/entities';

export const USER_WITHOUT_ORGANIZATION = 'UserWithoutOrganization';
export const Permit = (...roles: Role[]) => {
  return applyDecorators(
    UseGuards(ACGuard<OrganizationMember>),
    UseRoles(...roles),
  );
};
