import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RoleModule } from './role/role.module';
import { OrganizationMemberModule } from './organization-member/organization-member.module';
import { OrganizationModule } from './organization/organization.module';
import { UserModule } from './user/user.module';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import configuration from './config/configuration';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { RoleService } from './role/role.service';
import { AccessControlModule } from 'nest-access-control';
import { RolesBuilderFactory } from './role/role.builder';
import { SmsModule } from './sms/sms.module';
import { MembershipPlanModule } from './membership-plan/membership-plan.module';
import { FormModule } from './form/form.module';
import { InvitationModule } from './invitation/invitation.module';
import { CommonFieldModule } from './common-field/common-field.module';
import { MemberCommonFieldModule } from './member-common-field/member-common-field.module';
import { FormCommonFieldModule } from './form-common-field/form-common-field.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: +configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        migrations: ['src/migration/*{.ts,.js}'],
        cli: {
          migrationsDir: 'src/migration',
        },
        // synchronize: true,
        // logging: true,
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    MailModule,
    UserModule,
    OrganizationModule,
    OrganizationMemberModule,
    RoleModule,
    AuthModule,
    AccessControlModule.forRootAsync({
      imports: [RoleModule],
      inject: [RoleService],
      useFactory: RolesBuilderFactory,
    }),
    SmsModule,
    MembershipPlanModule,
    FormModule,
    InvitationModule,
    CommonFieldModule,
    MemberCommonFieldModule,
    FormCommonFieldModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
