import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { USER_WITHOUT_ORGANIZATION } from '../decorators/allow-user-without-organization.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
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

    // check if not authentication route
    const allowUserWithoutOrganization = this.reflector.getAllAndOverride<
      string[]
    >(USER_WITHOUT_ORGANIZATION, [context.getHandler(), context.getClass()]);

    if (allowUserWithoutOrganization) {
      const [req] = context.getArgs();
      console.log(req);
      // and throw error if user is not member of any organization
      return true;
    }
    return super.canActivate(context);
  }
}
