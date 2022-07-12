import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import { OrganizationMember } from 'src/organization-member/entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(public userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    const user = await this.userService.getUserByUsername(payload.username);
    if (!user) {
      throw new UnauthorizedException();
    }
    if (payload.organizationId) {
      const member = await OrganizationMember.findOne({
        where: { userId: user.id, organizationId: payload.organizationId },
        relations: ['role', 'organization', 'user'],
      });
      // workaround for ACGuard
      (member as any).roles = [member.role.slug];

      // ensure password is removed
      delete member.password;

      return member;
    }
    return user;
  }
}
