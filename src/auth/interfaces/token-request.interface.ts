import { Request } from 'express';
import { OrganizationMember } from 'src/organization-member/entities';
import { TokenData } from '../dto/token-data.dto';

export interface TokenRequest extends Request {
  user: OrganizationMember;
  tokenData: TokenData;
  organizationId: number;
}
