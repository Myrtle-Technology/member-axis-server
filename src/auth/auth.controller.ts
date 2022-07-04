import { Controller, Post, Body, Request, ParseIntPipe } from '@nestjs/common';
import { Request as ERequest } from 'express';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { ApiHeader } from '@nestjs/swagger';

@ApiHeader({
  name: 'x-organization-slug',
  description: 'Custom header',
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('verify-email')
  verifyEmail(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmail(dto);
  }

  @Post('validate-otp')
  validateOTP(@Body('otp', ParseIntPipe) otp: number) {
    return this.authService.validateOTP(otp);
  }

  @Post('update-personal-details')
  updatePersonalDetails(@Request() req: ERequest, @Body() dto: UpdateUserDto) {
    return this.authService.updatePersonalDetails((req as any).tokenData, dto);
  }

  @Post('create-organization')
  createOrganization(
    @Request() req: ERequest,
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.authService.createOrganization((req as any).tokenData, dto);
  }

  @Post(':id')
  login(@Request() req: ERequest, @Body() dto: LoginDto) {
    return this.authService.login((req as any).tokenData.organizationId, dto);
  }
}
