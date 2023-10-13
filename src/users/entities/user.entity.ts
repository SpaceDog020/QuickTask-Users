import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
@ObjectType()
export class User {
  @PrimaryGeneratedColumn()
  @Field((type) => Int)
  id: number;
  
  @Column()
  @Field()
  name: string;
  
  @Column()
  @Field()
  lastName: string;

  @Column({ unique: true })
  @Field()
  email: string;

  @Column()
  @Field()
  password: string;

  @Column({ nullable: true })
  @Field({ nullable: true })
  accessToken: string;

  @Column({ nullable: true, unique: true })
  @Field((type) => Int, { nullable: true })
  recoveryPass: number;
}

@ObjectType()
export class Response {
  @Field()
  response: boolean;
}