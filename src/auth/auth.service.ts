import {
  BadRequestException,
  Injectable,
  Scope,
  Inject,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
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
import { TokenRequest } from './interfaces/token-request.interface';

@Injectable({ scope: Scope.REQUEST })
export class AuthService {
  private readonly saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  private readonly isDevServer: string =
    this.configService.get<string>('IS_DEV_SERVER');
  constructor(
    @Inject(REQUEST) private request: TokenRequest,
    private mailService: MailService,
    private smsService: SmsService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private userService: UserService,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private organizationMemberService: OrganizationMemberService,
  ) {}

  get organizationSlug() {
    return this.request.headers[ORGANIZATION_API_HEADER];
  }

  get organizationId() {
    return this.request.tokenData.organizationId;
  }

  async verifyEmailOrPhone(dto: VerifyEmailDto) {
    let user: User;
    user = await this.userService.getUserByUsername(dto.username, false);
    if (!user) {
      user = await this.userService.createUserByUsername(dto.username);
    }
    if (!(this.isDevServer == 'true')) {
      if (isEmail(dto.username)) {
        const code = Math.floor(100000 + Math.random() * 900000);
        const token = await this.createToken(user, code.toString());
        await this.mailService.sendVerificationCode(user, token.token);
      } else {
        await this.smsService.sendOTP(user.phone);
      }
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
    if (!(this.isDevServer == 'true')) {
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
    return this.userService.updateOne(userId, dto);
  }

  async createOrganization(userId: number, dto: CreateOrganizationPasswordDto) {
    dto.ownerId = userId;
    const user = await this.userService.findOne(userId);
    const organization = await this.organizationService.create(dto);
    const role = await this.roleService.getDefaultAdminRole();
    const member = await this.organizationMemberService.createOne({
      organizationId: organization.id,
      userId: userId,
      roleId: role.id,
      password: dto.password,
      officeTitle: dto.officeTitle,
      contactPhone: user.phone,
    });
    delete member.password;
    this.mailService.welcomeRegisteredOrganization(user, organization);
    return { ...member, organization, user, role };
  }

  async validateOrganizationMember(dto: LoginDto) {
    const user: User = await this.userService.getUserByUsername(dto.username);
    const organizationSlug = this.request.headers[
      ORGANIZATION_API_HEADER
    ] as string;
    if (!organizationSlug) {
      throw new BadRequestException(
        'Please specify the organization you want to login to',
      );
    }
    const organization = await this.organizationService.getOrganizationBySlug(
      organizationSlug,
    );

    if (!organization) {
      throw new NotFoundException(
        `We do not have an organization with the slug=(${organizationSlug})`,
      );
    }

    const member = await OrganizationMember.findOne({
      where: { userId: user.id, organizationId: organization.id },
    });
    if (!member) {
      throw new UnauthorizedException(
        `You are not a member of this organization, try joining the organization first.`,
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
    const organizationMember = (this.request as any).user;
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
