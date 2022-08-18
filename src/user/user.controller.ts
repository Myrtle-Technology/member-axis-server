import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { TokenRequest } from 'src/auth/interfaces/token-request.interface';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(public service: UserService) {}

  @Get('me')
  me(@Request() req: TokenRequest) {
    return req.user;
  }

  @Post('me')
  @ApiBody({ type: UpdateUserDto })
  updateMe(@Request() request: TokenRequest, @Body() dto: UpdateUserDto) {
    return this.service.updateOne(request.user.id, dto);
  }
}
