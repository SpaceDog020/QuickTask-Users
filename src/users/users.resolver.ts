import { Query, Resolver, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { RegisterUserInput } from './dto/register-user.input';
import { ConflictException } from '@nestjs/common';
import { AuthResponse } from 'src/auth/dto/auth-response.dto';

@Resolver()
export class UsersResolver {
    constructor(
        private usersService: UsersService,
    ) {}

    @Query((returns) => [User])
    users() {
        return this.usersService.findAll();
    }

    @Query((returns) => User)
    user(@Args('id', { type: () => Int }) id: number) {
        return this.usersService.findUserById(id);
    }

    @Query((returns) => User)
    email(@Args('email', { type: () => String }) email: string) {
        return this.usersService.findUserByEmail(email);
    }

    @Mutation((returns) => AuthResponse)
    async register(@Args('userInput') userInput: RegisterUserInput) {
        
        // Verifica si el correo electrónico ya está en uso
        const existingUser = await this.usersService.findUserByEmail(userInput.email);
        if (existingUser) {
            return {response: "El correo electrónico ya está en uso" };
        }

        // Crea un nuevo usuario
        const newUser = await this.usersService.registerUser(userInput);
        return { response: "" };
    }
}
