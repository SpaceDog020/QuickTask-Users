import { Query, Resolver, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ResponseUser, User } from './entities/user.entity';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { RecoveryUserInput, ValidateRecoveryUserInput } from './dto/recovery-user.input.';
import { ChangePassRecoveryUserInput, ChangePassUserInput, UpdateUserInput } from './dto/update-user.input';

@Resolver()
export class UsersResolver {
    constructor(
        private usersService: UsersService,
    ) { }

    @Query((returns) => [User])
    users() {
        console.log("[*] users");
        return this.usersService.findAll();
    }

    @Query((returns) => User)
    user(@Args('id', { type: () => Int }) id: number) {
        console.log("[*] user");
        return this.usersService.findUserById(id);
    }

    @Query((returns) => User)
    email(@Args('email', { type: () => String }) email: string) {
        console.log("[*] email");
        return this.usersService.findUserByEmail(email);
    }

    @Query((returns) => [User])
    async usersByIds(@Args('ids', { type: () => [Int] }) ids: number[]) {
        console.log("[*] usersByIds");
        return this.usersService.findUsersByIds(ids);
    }

    @Mutation((returns) => ResponseUser)
    async register(@Args('userInput') userInput: RegisterUserInput) {
        console.log("[*] register");
        // Verifica si el correo electrónico ya está en uso
        const existingUser = await this.usersService.findUserByEmail(userInput.email);
        if (existingUser) {
            return { response: false };
        }

        // Crea un nuevo usuario
        const newUser = await this.usersService.registerUser(userInput);
        return { response: true };
    }

    @Mutation((returns) => ResponseUser)
    async recovery(@Args('recoveryInput') recoveryInput: RecoveryUserInput) {
        console.log("[*] recovery");
        try {
            const sentEmail = await this.usersService.sendRecoveryEmail(recoveryInput);
            if (sentEmail) {
                return { response: true };
            } else {
                return { response: false };
            }
        }catch(error){
            throw new Error(error.message);
        }
    }

    @Mutation((returns) => ResponseUser)
    async validateRecovery(@Args('validaterecoveryInput') validateRecoveryInput: ValidateRecoveryUserInput) {
        console.log("[*] validateRecovery");
        try {
            const validate = await this.usersService.validateRecovery(validateRecoveryInput);
            if (validate) {
                return { response: true };
            } else {
                return { response: false };
            }
        }catch(error){
            throw new Error(error.message);
        }
    }

    @Mutation((returns) => ResponseUser)
    async changePassRecovery(@Args('changePassRecoveryUserInput') changePassRecoveryUserInput: ChangePassRecoveryUserInput) {
        console.log("[*] changePassRecovery");
        try {
            const validate = await this.usersService.changePassRecovery(changePassRecoveryUserInput);
            if (validate) {
                return { response: true };
            } else {
                return { response: false };
            }
        }catch(error){
            throw new Error(error.message);
        }
    }

    @Mutation((returns) => ResponseUser)
    async changePassword(@Args('changePassInput') changePassInput: ChangePassUserInput) {
        console.log("[*] changePassword");
        try {
            const validate = await this.usersService.changePassword(changePassInput);
            if (validate) {
                return { response: true };
            } else {
                return { response: false };
            }
        }catch(error){
            throw new Error(error.message);
        }
    }

    @Mutation((returns) => User)
    async login(@Args('loginInput') loginInput: LoginUserInput) {
        console.log("[*] login");
        try {
            return await this.usersService.login(loginInput);
        }catch(error){
            throw new Error(error.message);
        }
    }

    @Mutation((returns) => ResponseUser)
    async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
        console.log("[*] updateUser");
        try {
            const validate = await this.usersService.updateUser(updateUserInput);
            if (validate) {
                return { response: true };
            } else {
                return { response: false };
            }
        }catch(error){
            throw new Error(error.message);
        }
    }
}
