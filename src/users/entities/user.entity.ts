import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';

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

  @Column('integer', { nullable: true, array: true })
  @Field((type) => [Int], { nullable: true })
  idTeams: number[];
}

@ObjectType()
export class ResponseUser {
  @Field()
  response: boolean;
}