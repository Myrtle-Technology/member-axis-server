import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities';

@Injectable()
export class UserService extends TypeOrmCrudService<User> {
  logger = new Logger(UserService.name);
  saltRounds = +this.configService.get<number>('SALT_ROUNDS');
  constructor(
    @InjectRepository(User) repo,
    private configService: ConfigService,
  ) {
    super(repo);
  }
}
