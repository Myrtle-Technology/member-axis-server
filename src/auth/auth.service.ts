import { BadRequestException, Injectable, Scope, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { isEmail } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { OrganizationMember } from 'src/organization-member/entities';
import { Token } from './entities/token.entity';
import { MailService } from 'src/mail/mail.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { OrganizationService } from 'src/organization/organization.service';
import { FindUserOrganization } from './dto/find-user-organization..dto';
import { OrganizationMemberService } from 'src/organization-member/organization-member.service';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { CreateOrganizationPasswordDto } from './dto/create-organization-password.dto';
import { ConfigService } from '@nestjs/config';
import { ORGANIZATION_API_HEADER } from './decorators/organization-api.decorator';
import { RoleService } from 'src/role/role.service';
import { SmsService } from 'src/sms/sms.service';
import { TokenData } from './dto/token-data.dto';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    @Inject(REQUEST) private request: Request,
    private mailService: MailService,
    private smsService: SmsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private organizationMemberService: OrganizationMemberService,
  ) {}

  async verifyEmailOrPhone(dto: VerifyEmailDto) {
    let user: User;
    user = await this.userService.getUserByUsername(dto.username, false);
    if (!user) {
      user = await this.userService.createUserByUsername(dto.username);
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    const token = await this.createToken(user, code.toString());
    if (isEmail(dto.username)) {
      await this.mailService.sendVerificationCode(user, token.token);
    } else {
      await this.smsService.sendOTPLocal(user.phone, token.token);
    }
    return user;
  }

  async createToken(user: User, code: string) {
    const token = await Token.findOne({
      where: { userId: user.id },
    });
    if (token) {
      await token.remove();
    }
    return await Token.create({
      token: code.toString(),
      userId: user.id,
    }).save();
  }

  async validateOTP(dto: VerifyOtpDto) {
    const user = await this.userService.getUserByUsername(dto.username);
    if (isEmail(dto.username)) {
      const token = await Token.findOne({
        where: { token: dto.otp.toString(), userId: user.id },
      });
      if (!token) {
        throw new BadRequestException(`OTP is invalid`);
      }
      await token.remove();
    } else {
      this.smsService.verifyOTP(user.phone, dto.otp.toString());
    }
    user.verified = true;
    await user.save();
    const payload = {
      username: user.email,
      userId: user.id,
    };
    // this access token will be used to access only three routes
    // update personal details, create organization, and find User Organizations
    return {
      accessToken: this.jwtService.sign(payload, { expiresIn: '24h' }),
      user: user,
    };
  }

  async updatePersonalDetails(userId: number, dto: UpdateUserDto) {
    // TODO: send a welcome Email to user
    return this.userService.update(userId, dto);
  }

  async createOrganization(userId: number, dto: CreateOrganizationPasswordDto) {
    dto.ownerId = userId;
    const user = await this.userService.findOne(userId);
    const organization = await this.organizationService.create(dto);
    const password = await bcrypt.hash(dto.password, this.saltRounds);
    const role = await this.roleService.getDefaultAdminRole();
    const member = await this.organizationMemberService.create({
      organizationId: organization.id,
      userId: userId,
      roleId: role.id,
      password: password,
      officeTitle: dto.officeTitle,
      contactPhone: user.phone,
    });
    delete member.password;
    // TODO: send a welcome Email to user
    this.mailService.welcomeRegisteredOrganization(user, organization);
    return member;
  }

  async validateOrganizationMember(dto: LoginDto) {
    const user: User = await this.userService.getUserByUsername(dto.username);
    const organizationSlug = this.request.headers[
      ORGANIZATION_API_HEADER
    ] as string;
    const organization = await this.organizationService.getOrganizationBySlug(
      organizationSlug,
    );
    const member = await OrganizationMember.findOne({
      where: { userId: user.id, organizationId: organization.id },
    });
    if (!member) {
      throw new BadRequestException(
        `You are not a member of this organization`,
      );
    }
    const passwordMatch = await bcrypt.compare(dto.password, member.password);

    if (passwordMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = member;
      return result;
    }
    return null;
  }

  async loginToOrganization(dto: LoginDto) {
    const organizationMember = (this.request as any).organizationMember;
    const payload: TokenData = {
      username: dto.username,
      organizationMemberId: organizationMember.id,
      organizationId: organizationMember.organizationId,
      userId: organizationMember.userId,
      roleId: organizationMember.roleId,
    };
    return {
      accessToken: this.jwtService.sign(payload),
      user: organizationMember,
    };
  }

  async findUserOrganizations(dto: FindUserOrganization) {
    const user = await this.userService.getUserByUsername(dto.username);

    const orgMember = await this.organizationMemberService.find({
      where: { userId: user.id },
      relations: ['organization'],
    });
    return orgMember.map((om) => om.organization);
  }

  async initForgotOrganizationPassword() {
    //
  }

  async forgotOrganizationPassword() {
    //
  }

  async acceptOrganizationInvite() {
    //
  }
}
