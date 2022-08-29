import { Module } from '@nestjs/common';
import { OrganizationMemberService } from './organization-member.service';
import { OrganizationMemberController } from './organization-member.controller';
import { OrganizationMember } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationMember]), SubscriptionModule],
  controllers: [OrganizationMemberController],
  providers: [OrganizationMemberService],
  exports: [
    OrganizationMemberService,
    TypeOrmModule.forFeature([OrganizationMember]),
  ],
})
export class OrganizationMemberModule {}
