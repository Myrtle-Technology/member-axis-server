import { IsInt, IsOptional, IsString } from 'class-validator';
import { IsSlug } from '../decorators/is-slug.decorator';

export class CreateOrganizationDto {
  @IsString()
  name: string;

  @IsSlug()
  slug: string;

  @IsString()
  contactEmail: string;

  @IsString()
  contactPhone: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  logoUrl?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  state?: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsInt()
  ownerId?: number;
}
