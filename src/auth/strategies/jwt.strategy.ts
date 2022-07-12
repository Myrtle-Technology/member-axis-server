import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import { OrganizationMemberService } from 'src/organization-member/organization-member.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public userService: UserService,
    public organizationMemberService: OrganizationMemberService,
  ) {
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
      const member = this.organizationMemberService.findOne({
        where: { userId: user.id, organizationId: payload.organizationId },
      });

      return member;
    }
    return user;
  }
}
