import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from '../constants';
import { UserService } from 'src/user/user.service';
import { OrganizationMemberService } from 'src/organization-member/organization-member.service';
import { Reflector } from '@nestjs/core';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    public userService: UserService,
    public organizationMemberService: OrganizationMemberService,
    private reflector: Reflector,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: any) {
    // const user = await this.userService.getUserByUsername(payload.username);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    // if (payload.organizationId) {
    //   const member = this.organizationMemberService.findOne({
    //     where: { memberId: user.id, organizationId: payload.organizationId },
    //   });

    //   return member;
    // }
    return payload;
  }
}