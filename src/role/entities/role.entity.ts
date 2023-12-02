import { ObjectType, Field, Int } from '@nestjs/graphql';
import { User } from 'src/users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity()
@ObjectType()
export class Role {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;
  
  @Column({ unique: true })
  @Field()
  name: string;

  @OneToMany(() => User, (user) => user.role) // Relación uno a muchos con User
  @Field(() => [User], { nullable: true })
  users: User[];
}

@ObjectType()
export class ResponseRole {
  @Field()
  response: boolean;
}