import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: ['email', 'mo'], passwordField: 'password' });
  }

  async validate(
    organizationId: number,
    username: string,
    password: string,
  ): Promise<any> {
    const organizationMember =
      await this.authService.validateOrganizationMember(organizationId, {
        username,
        password,
      });
    if (!organizationMember) {
      throw new UnauthorizedException();
    }
    return organizationMember;
  }
}