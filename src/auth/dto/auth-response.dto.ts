import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  name: string;
  
  @Field()
  response: Boolean;

  @Field()
  accessToken: string;
}