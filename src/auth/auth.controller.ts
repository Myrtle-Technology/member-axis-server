import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { Request as ERequest } from 'express';
import { AuthService } from './auth.service';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';
import { AllowUserWithoutOrganization } from './decorators/allow-user-without-organization.decorator';
import { FindUserOrganization } from './dto/find-user-organization..dto';
import { Public } from './decorators/public.decorator';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CreateOrganizationPasswordDto } from './dto/create-organization-password.dto';
import { TokenRequest } from './interfaces/token-request.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { OrganizationApi } from './decorators/organization-api.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('verify-email-or-phone')
  verifyEmailOrPhone(@Body() dto: VerifyEmailDto) {
    return this.authService.verifyEmailOrPhone(dto);
  }

  @Public()
  @Post('validate-otp')
  validateOTP(@Body() dto: VerifyOtpDto) {
    return this.authService.validateOTP(dto);
  }

  @AllowUserWithoutOrganization()
  @Post('update-personal-details')
  updatePersonalDetails(
    @Request() req: TokenRequest,
    @Body() dto: UpdateUserDto,
  ) {
    return this.authService.updatePersonalDetails(req.tokenData.userId, dto);
  }

  @AllowUserWithoutOrganization()
  @Post('create-organization')
  createOrganization(
    @Request() req: TokenRequest,
    @Body() dto: CreateOrganizationPasswordDto,
  ) {
    return this.authService.createOrganization(req.tokenData.userId, dto);
  }

  @OrganizationApi()
  @UseGuards(LocalAuthGuard)
  @Public()
  @Post('login')
  login(@Request() req: ERequest, @Body() dto: LoginDto) {
    return this.authService.loginToOrganization(dto);
  }

  @AllowUserWithoutOrganization()
  findUserOrganizations(
    @Request() req: TokenRequest,
    @Body() dto: FindUserOrganization,
  ) {
    return this.authService.findUserOrganizations(dto);
  }
}
