import { Field, InputType, Int } from "@nestjs/graphql";;

@InputType()
export class DeleteUserInput {
    @Field((type) => Int)
    idUser: number;

    @Field()
    password: string;
}