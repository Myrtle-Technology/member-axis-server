import { ApiHeader } from '@nestjs/swagger';

export function OrganizationApi() {
  return ApiHeader({
    name: 'x-organization-slug',
    description: 'Organization Slug',
  });
}
