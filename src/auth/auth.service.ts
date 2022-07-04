import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from 'src/organization/dto/create-organization.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { LoginDto } from './dto/login.dto';
import { isEmail, isPhoneNumber } from 'class-validator';
import * as bcrypt from 'bcrypt';
import { OrganizationMember } from 'src/organization-member/entities';

@Injectable()
export class AuthService {
  async verifyEmail(dto: VerifyEmailDto) {
    let user: User;
    // find or create user with email
    // user = User.findOne({ where: { email: dto.email } });
    if (!user) {
      user = User.create({ email: dto.email });
      user.save();
    }
    // generate a 6 digit code
    const code = Math.floor(100000 + Math.random() * 900000);
    // store code in database
    // send code to user's email
  }

  validateOTP(otp: number) {
    // find token with 6 digit code
    // get user that owns that token
    // if user/token does not exist, throw error
    // if user is verified, return user
  }

  updatePersonalDetails(user: User, personalDetails: UpdateUserDto) {
    return `This action returns all auth`;
  }

  createOrganization(user: User, organizationDetails: CreateOrganizationDto) {
    return null;
  }

  async validateUser(organizationId: number, dto: LoginDto) {
    let user: User;
    if (isPhoneNumber(dto.username)) {
      user = await User.findOne({ where: { phoneNumber: dto.username } });
    }
    if (isEmail(dto.username)) {
      user = await User.findOne({ where: { email: dto.username } });
    }
    if (!user) {
      throw new BadRequestException(
        `Username and password combination is incorrect`,
      );
    }
    const member = await OrganizationMember.findOne({
      where: { memberId: user.id, organizationId },
    });
    if (!member) {
      throw new BadRequestException(
        `Username and password combination is incorrect`,
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

  async login(organizationId: number, dto: LoginDto) {
    const currentUser = await this.validateUser(organizationId, dto);
    // const payload = {
    //   username: user.email,
    //   password: user.password,
    // };
    // return {
    //   accessToken: this.jwtService.sign(payload),
    //   user: user,
    // };
  }
}
