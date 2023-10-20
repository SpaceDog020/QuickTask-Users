import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class UpdateUserInput{
    @IsNotEmpty()
    @Field()
    oldEmail: string;
    
    @Field({ nullable: true })
    name: string;

    @Field({ nullable: true })
    lastName: string;

    @IsEmail()
    @Field({ nullable: true })
    email: string;

    @Field({ nullable: true })
    password: string;
}

@InputType()
export class ChangePassUserInput{
    @IsNotEmpty()
    @IsEmail()
    @Field()
    email: string;
    
    @IsNotEmpty()
    @Field()
    oldPassword: string;

    @IsNotEmpty()
    @Field()
    newPassword: string;
}

@InputType()
export class ChangePassRecoveryUserInput{
    @IsNotEmpty()
    @Field()
    password: string;

    @IsNotEmpty()
    @Field((type) => Int)
    recoveryPass: number;
}