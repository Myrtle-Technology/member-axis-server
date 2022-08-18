import { Controller } from '@nestjs/common';
import { MemberCommonFieldService } from './member-common-field.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrganizationApi } from 'src/auth/decorators/organization-api.decorator';

@ApiBearerAuth()
@OrganizationApi()
@ApiTags('member-common-field')
@Controller('member-common-field')
export class MemberCommonFieldController {
  constructor(
    private readonly memberCommonFieldService: MemberCommonFieldService,
  ) {}
}
