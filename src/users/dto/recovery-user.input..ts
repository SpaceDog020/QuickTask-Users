import { Field, InputType, Int } from "@nestjs/graphql";
import { IsNotEmpty, IsEmail } from "class-validator";

@InputType()
export class RecoveryUserInput {
  @IsNotEmpty()
  @IsEmail()
  @Field()
  email: string;
}

@InputType()
export class ValidateRecoveryUserInput {
  @IsNotEmpty()
  @Field((type) => Int)
  recoveryPass: number;
}