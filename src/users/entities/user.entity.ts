import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @ObjectIdColumn() id: ObjectID;

  @Column() firstName: string;

  @Column() lastName: string;

  @IsEmail()
  @Column()
  email: string;

  @IsPhoneNumber()
  @Column()
  phone: string;

  @Exclude()
  @Column()
  password: string;

  @Column() createdAt: Date;

  @Column() updatedAt: Date;
}
