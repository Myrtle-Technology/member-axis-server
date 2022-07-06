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

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    @Inject(REQUEST) private request: Request,
    private mailService: MailService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
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
    console.log(user.id);
    await Token.create({ token: code.toString(), userId: user.id }).save();
    if (isEmail(dto.username)) {
      // this.mailService.sendVerificationCode(user.email, code);
    } else {
      // send SMS with code
    }
    console.log(code);
    return user;
  }

  async validateOTP(dto: VerifyOtpDto) {
    const user = await this.userService.getUserByUsername(dto.username);
    const token = await Token.findOne({ where: { token: dto.otp.toString() } });
    if (!token) {
      throw new BadRequestException(`OTP is invalid`);
    }
    await this.userService.update(token.userId, { verified: true });
    await token.remove();
    // TODO: send Email to user
    const payload = {
      username: user.email,
      userId: token.userId,
    };
    // this access token will be used to access only three routes
    // update personal details, create organization, and find User Organizations
    return { accessToken: this.jwtService.sign(payload), user: token.user };
  }

  async updatePersonalDetails(userId: number, dto: UpdateUserDto) {
    return this.userService.update(userId, dto);
  }

  async createOrganization(userId: number, dto: CreateOrganizationPasswordDto) {
    dto.ownerId = userId;
    const organization = await this.organizationService.create(dto);
    const password = await bcrypt.hash(dto.password, this.saltRounds);
    return this.organizationMemberService.create({
      organizationId: organization.id,
      userId: userId,
      roleId: 1,
      password: password,
    });
  }

  async validateOrganizationMember(dto: LoginDto) {
    const user: User = await this.userService.getUserByUsername(dto.username);
    const organizationSlug = this.request.headers[
      'x-organization-slug'
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
    // this line will not be needed when we have jwt service
    const organizationMember = await this.validateOrganizationMember(dto);
    const payload = {
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
}
