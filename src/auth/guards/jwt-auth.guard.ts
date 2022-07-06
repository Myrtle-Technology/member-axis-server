import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { USER_WITHOUT_ORGANIZATION } from '../decorators/allow-user-without-organization.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const [req] = context.getArgs();
    const bearerToken: string[] = (req.headers.authorization || '').split(' ');
    if (bearerToken.length > 1) {
      req.tokenData = this.jwtService.decode(
        req.headers.authorization.split(' ')[1],
      );
    }
    // check if not authentication route
    const allowUserWithoutOrganization =
      this.reflector.getAllAndOverride<boolean>(USER_WITHOUT_ORGANIZATION, [
        context.getHandler(),
        context.getClass(),
      ]);

    // if it is not an a allowUserWithoutOrganization route,
    // and user has no organization, throw exception
    if (
      !allowUserWithoutOrganization &&
      req.tokenData?.organizationId !== null
    ) {
      throw new UnauthorizedException(
        'User is not allowed to access this route',
      );
    }
    return super.canActivate(context);
  }
}
