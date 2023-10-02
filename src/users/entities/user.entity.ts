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
}