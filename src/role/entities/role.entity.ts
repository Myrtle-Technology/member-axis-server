import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { Permissions } from './permission.entity';

@Entity()
export class Role {
  @ObjectIdColumn() id: ObjectID;

  @IsNotEmpty()
  @Column()
  name: string;

  @IsNotEmpty()
  @Column()
  slug: string;

  @IsOptional()
  @Column()
  description: string;

  permissions: Permissions[];

  @Column({ nullable: true })
  organizationId: string; // TODO: add organizationId association to role

  @Column() createdAt: Date;

  @Column() updatedAt: Date;
}
