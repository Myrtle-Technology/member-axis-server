import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { TypeOrmCrudService } from '@rewiko/crud-typeorm';
import { isEmail, isPhoneNumber } from 'class-validator';
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

  async update(userId: number, dto: UpdateUserDto) {
    return this.repo.update(userId, dto);
  }

  async create(dto: CreateUserDto) {
    return this.repo.create(dto).save();
  }

  async getUserByUsername(username: string, throwError = true) {
    let user: User;
    if (isPhoneNumber(username)) {
      user = await this.findOne({
        where: { phoneNumber: username },
      });
    }
    if (isEmail(username)) {
      user = await this.findOne({ where: { email: username } });
    }
    if (!user && throwError) {
      throw new BadRequestException(`Username is invalid`);
    }
    return user;
  }

  async createUserByUsername(username: string) {
    let user: User;
    if (isPhoneNumber(username)) {
      user = await this.create({ phoneNumber: username });
    }
    if (isEmail(username)) {
      user = await this.create({ firstName: username, email: username });
    }
    return user;
  }
}
