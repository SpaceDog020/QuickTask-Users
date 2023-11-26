import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";

@InputType()
export class DeleteRoleInput{
    @IsNotEmpty()
    @Field((type) => Int)
    idRole: number;
}