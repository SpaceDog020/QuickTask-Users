import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class UpdateUserInput{
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    lastName: string;

    @IsEmail()
    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    password: string;

    @Field((type) => Int, { nullable: true })
    recoveryPass: number;
}

@InputType()
export class ChangePassUserInput{
    @IsNotEmpty()
    @Field()
    password: string;

    @IsNotEmpty()
    @Field((type) => Int)
    recoveryPass: number;
}