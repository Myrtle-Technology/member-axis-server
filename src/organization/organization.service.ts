import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { UpdateOrganizationDto } from './dto/update-organization.dto';
import { Organization } from './entities';

@Injectable()
export class OrganizationService extends TypeOrmCrudService<Organization> {
  logger = new Logger(OrganizationService.name);
  constructor(@InjectRepository(Organization) repo) {
    super(repo);
  }

  async update(organizationId: number, dto: UpdateOrganizationDto) {
    return this.repo.update(organizationId, dto);
  }

  async create(dto: CreateOrganizationDto) {
    return this.repo.create(dto);
  }
}
