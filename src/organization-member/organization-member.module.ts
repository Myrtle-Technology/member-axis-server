import { forwardRef, Module } from '@nestjs/common';
import { OrganizationMemberService } from './organization-member.service';
import { OrganizationMemberController } from './organization-member.controller';
import { OrganizationMember } from './entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([OrganizationMember])],
  controllers: [OrganizationMemberController],
  providers: [OrganizationMemberService],
  exports: [
    OrganizationMemberService,
    TypeOrmModule.forFeature([OrganizationMember]),
  ],
})
export class OrganizationMemberModule {}
