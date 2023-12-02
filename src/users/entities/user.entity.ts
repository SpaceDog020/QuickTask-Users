import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Role } from 'src/role/entities/role.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

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

  @ManyToOne(() => Role, role => role.users)
  @JoinColumn({ name: 'roleId' })
  @Field(() => Role, { nullable: true })
  role: Role;

  @Column({ nullable: true })
  @Field({ nullable: true })
  accessToken: string;

  @Column({ nullable: true, unique: true })
  @Field((type) => Int, { nullable: true })
  recoveryPass: number;
}

@ObjectType()
export class ResponseUser {
  @Field()
  response: boolean;
}