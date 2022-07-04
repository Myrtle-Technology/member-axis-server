import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';
import { CreateOrganizationMemberDto } from './dto/create-organization-member.dto';
import { UpdateOrganizationMemberDto } from './dto/update-organization-member.dto';
import { OrganizationMember } from './entities';

@Injectable()
export class OrganizationMemberService extends TypeOrmCrudService<OrganizationMember> {
  logger = new Logger(OrganizationMemberService.name);
  constructor(@InjectRepository(OrganizationMember) repo) {
    super(repo);
  }
}
