import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from 'src/mail/mail.module';
import { OrganizationModule } from 'src/organization/organization.module';
import { UserModule } from 'src/user/user.module';
import { OrganizationMemberModule } from 'src/organization-member/organization-member.module';
import { jwtConstants } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { RoleModule } from 'src/role/role.module';
import { SmsModule } from 'src/sms/sms.module';
import { ConfigModule } from '@nestjs/config';
import { MemberCommonFieldModule } from 'src/member-common-field/member-common-field.module';
import { MembershipPlanModule } from 'src/membership-plan/membership-plan.module';

@Module({
  imports: [
    ConfigModule,
    MailModule,
    SmsModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60d' },
    }),
    PassportModule.register({ defaultStrategy: 'Bearer' }),
    UserModule,
    RoleModule,
    OrganizationModule,
    OrganizationMemberModule,
    MemberCommonFieldModule,
    MembershipPlanModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, LocalStrategy],
  exports: [AuthService, JwtModule, JwtStrategy, LocalStrategy],
})
export class AuthModule {}
