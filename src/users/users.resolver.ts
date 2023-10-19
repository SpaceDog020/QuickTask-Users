import { Query, Resolver, Args, Int, Mutation } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { ResponseUser, User  } from './entities/user.entity';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { RecoveryUserInput, ValidateRecoveryUserInput } from './dto/recovery-user.input.';
import { ChangePassUserInput, UpdateUserInput } from './dto/update-user.input';
import { AddTeamInput } from './dto/add-team.input';
import { DeleteTeamFromUserInput } from './dto/delete-team-from-user.input';

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

    @Mutation((returns) => ResponseUser)
    async register(@Args('userInput') userInput: RegisterUserInput) {
        
        // Verifica si el correo electrónico ya está en uso
        const existingUser = await this.usersService.findUserByEmail(userInput.email);
        if (existingUser) {
            return {response: false };
        }

        // Crea un nuevo usuario
        const newUser = await this.usersService.registerUser(userInput);
        return {response: true };
    }

    @Mutation((returns) => ResponseUser)
    async recovery(@Args('recoveryInput') recoveryInput: RecoveryUserInput) {
        try{
            const sentEmail = await this.usersService.sendRecoveryEmail(recoveryInput);
            if(sentEmail){
                return {response: true };
            }else{
                return {response: false };
            }
        }catch(error){
            if(error.message === 'user does not exist'){
                throw new Error('user does not exist');
            }else if(error.message === 'email could not be sent' ){
                throw new Error('email could not be sent');
            }else{
                throw new Error('An error occurred' );
            }
        }
    }

    @Mutation((returns) => ResponseUser)
    async validateRecovery(@Args('validaterecoveryInput') validateRecoveryInput: ValidateRecoveryUserInput) {
        try{
            const validate = await this.usersService.validateRecovery(validateRecoveryInput);
            if(validate){
                return {response: true };
            }else{
                return {response: false };
            }
        }catch(error){
            if(error.message === 'incorrect recovery code'){
                throw new Error('incorrect recovery code');
            }else{
                throw new Error('An error occurred');
            }
        }
    }

    @Mutation((returns) => ResponseUser)
    async changePass(@Args('changePassUserInput') changePassUserInput: ChangePassUserInput) {
        try{
            const validate = await this.usersService.changePass(changePassUserInput);
            if(validate){
                return {response: true };
            }else{
                return {response: false };
            }
        }catch(error){
            if(error.message === 'same password'){
                throw new Error('same password');
            }else{
                throw new Error('An error occurred');
            }
        }
    }

    @Mutation((returns) => User)
    async login(@Args('loginInput') loginInput: LoginUserInput) {
        try{
            return await this.usersService.login(loginInput);
        }catch(error){
            if(error.message === 'user does not exist'){
                throw new Error('user does not exist');
            }else if(error.message === 'incorrect password'){
                throw new Error('incorrect password');
            }else{
                throw new Error('An error occurred');
            }
        }
    }

    @Mutation((returns) => ResponseUser)
    async addTeam(@Args('addTeamInput') addTeamInput: AddTeamInput){
        try{
            const validate = await this.usersService.addTeam(addTeamInput);
            if(validate){
                return {response: true };
            }else{
                return {response: false };
            }
        }catch(error){
            if(error.message === 'user does not exist'){
                throw new Error('user does not exist');
            }else if(error.message === 'team already added'){
                throw new Error('team already added');
            }else{
                throw new Error('An error occurred');
            }
        }
    }

    @Mutation((returns) => ResponseUser)
    async deleteTeamFromUser(@Args('deleteTeamFromUserInput') deleteTeamFromUserInput: DeleteTeamFromUserInput){
        try{
            const validate = await this.usersService.deleteTeam(deleteTeamFromUserInput);
            if(validate){
                return {response: true };
            }else{
                return {response: false };
            }
        }catch(error){
            if(error.message === 'user does not exist'){
                throw new Error('user does not exist');
            }else if(error.message === 'team list is empty'){
                throw new Error('team list is empty');
            }else if(error.message === 'team does not exist'){
                throw new Error('team does not exist');
            }else{
                throw new Error('An error occurred');
            }
        }
    }
}
