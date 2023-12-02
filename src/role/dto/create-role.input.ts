import { Field, InputType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class CreateRoleInput{
    @IsNotEmpty()
    @Field()
    name: string;
}