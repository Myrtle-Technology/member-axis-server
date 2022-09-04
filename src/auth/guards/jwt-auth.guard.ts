import {
  BadRequestException,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { OrganizationService } from 'src/organization/organization.service';
import { USER_WITHOUT_ORGANIZATION } from '../decorators/allow-user-without-organization.decorator';
import { ORGANIZATION_API_HEADER } from '../decorators/organization-api.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { TokenData } from '../dto/token-data.dto';
import { TokenRequest } from '../interfaces/token-request.interface';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    protected reflector: Reflector,
    private jwtService: JwtService,
    private organizationService: OrganizationService,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    const request: TokenRequest = context.switchToHttp().getRequest();
    if (isPublic) {
      const organizationSlug = request.headers[
        ORGANIZATION_API_HEADER
      ] as string;

      if (organizationSlug == 'gembrs') {
        return true;
      }

      if (!organizationSlug) {
        throw new BadRequestException(
          'Please specify the organization you want to access',
        );
      }

      return this.organizationService
        .findOne({
          slug: organizationSlug,
        })
        .then((organization) => {
          if (!organization)
            throw new NotFoundException(
              'No organization with the specified site name was found',
            );
          request.organizationId = organization.id;
          return !!organization;
        });
    }
    const bearerToken: string[] = (request.headers.authorization || '').split(
      ' ',
    );
    if (bearerToken.length > 1) {
      request.tokenData = this.jwtService.decode(
        request.headers.authorization.split(' ')[1],
      ) as TokenData;
    }
    // check if not authentication route
    const allowUserWithoutOrganization =
      this.reflector.getAllAndOverride<boolean>(USER_WITHOUT_ORGANIZATION, [
        context.getHandler(),
        context.getClass(),
      ]);

    // if it is not an a allowUserWithoutOrganization route,
    // and user has no organization, throw exception
    if (!allowUserWithoutOrganization && !request.tokenData?.organizationId) {
      throw new UnauthorizedException(
        'User is not allowed to access this route',
      );
    }
    return super.canActivate(context);
  }
}
