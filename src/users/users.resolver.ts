import { Mutation, Query, Resolver, Args, Int } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';

@Resolver()
export class UsersResolver {
    constructor(private usersService: UsersService) {}

    @Query((returns) => [User])
    users() {
        return this.usersService.findAll();
    }

    @Query((returns) => User)
    user(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.findUserById(id);
    }

    @Mutation((returns) => User)
    createUser(@Args('userInput') userInput: CreateUserInput){
       return this.usersService.createUser(userInput);
    }
}
