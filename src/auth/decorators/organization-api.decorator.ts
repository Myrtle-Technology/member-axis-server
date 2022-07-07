import { ApiHeader } from '@nestjs/swagger';

export const ORGANIZATION_API_HEADER = 'x-organization-slug';

export function OrganizationApi() {
  return ApiHeader({
    name: ORGANIZATION_API_HEADER,
    description: 'Organization Slug or Site Name',
  });
}
