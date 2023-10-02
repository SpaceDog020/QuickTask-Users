import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class CreateUserInput{
    @IsNotEmpty()
    @Field()
    name: string;

    @IsNotEmpty()
    @Field()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;
}