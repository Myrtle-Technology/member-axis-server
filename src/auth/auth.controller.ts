import { Controller, Post, Body, Request, ParseIntPipe } from '@nestjs/common';
import { Request as ERequest } from 'express';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { ApiHeader, ApiTags } from '@nestjs/swagger';
import { AllowUserWithoutOrganization } from './decorators/allow-user-without-organization.decorator';
import { FindUserOrganization } from './dto/find-user-organization..dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('verify-email-or-phone')
  verifyEmailOrPhone(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmailOrPhone(dto);
  }

  @Post('validate-otp')
  validateOTP(@Body('otp', ParseIntPipe) otp: number) {
    return this.authService.validateOTP(otp);
  }

  @AllowUserWithoutOrganization()
  @Post('update-personal-details')
  updatePersonalDetails(@Request() req: ERequest, @Body() dto: UpdateUserDto) {
    return this.authService.updatePersonalDetails((req as any).user.id, dto);
  }

  @AllowUserWithoutOrganization()
  @Post('create-organization')
  createOrganization(
    @Request() req: ERequest,
    @Body() dto: CreateOrganizationDto,
  ) {
    return this.authService.createOrganization(
      (req as any).tokenData.user.id,
      dto,
    );
  }

  @ApiHeader({
    name: 'x-organization-slug',
    description: 'Organization Slug',
  })
  @Post('login')
  login(@Request() req: ERequest, @Body() dto: LoginDto) {
    return this.authService.loginToOrganization(
      (req as any).tokenData.organizationId,
      dto,
    );
  }

  @AllowUserWithoutOrganization()
  findUserOrganizations(
    @Request() req: ERequest,
    @Body() dto: FindUserOrganization,
  ) {
    return this.authService.findUserOrganizations(dto);
  }

  // personal details, create organization, and find User Organizations
}
