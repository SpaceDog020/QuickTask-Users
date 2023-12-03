import { Query, Resolver, Args, Int, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { request } from 'graphql-request';
import { UsersService } from './users.service';
import { RoleService } from 'src/role/role.service';
import { ResponseUser, User } from './entities/user.entity';
import { RegisterUserInput } from './dto/register-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { RecoveryUserInput, ValidateRecoveryUserInput } from './dto/recovery-user.input.';
import { AddRoleUserInput, ChangePassRecoveryUserInput, ChangePassUserInput, RemoveRoleAllUsersInput, RemoveRoleUserInput, UpdateUserInput } from './dto/update-user.input';
import { DeleteUserInput } from './dto/delete-user.input';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Role } from 'src/role/entities/role.entity';

@Resolver(() => User)
export class UsersResolver {
    constructor(
        private usersService: UsersService,
        private rolesService: RoleService
    ) { }

    @Query((returns) => User)
    validateUser(@Args('id', { type: () => Int }) id: number) {
        console.log("[*] validateUser");
        return this.usersService.findUserById(id);
    }

    @Query((returns) => [User])
    users() {
        console.log("[*] users");
        return this.usersService.findAll();
    }

    @Query((returns) => [User])
    async usersByTeamId(@Args('teamId', { type: () => Int }) teamId: number) {
        console.log("[*] usersByTeamId");
        interface TeamResponse {
            team: {
                idUsers: number[];
            };
        }

        try {
            const teamQuery = `
                query {
                    team(id: ${teamId}) {
                    idUsers
                    }
                }
            `;

            const team: TeamResponse = await request('http://localhost:3002/graphql', teamQuery);

            if (!team) {
                throw new Error('El equipo no existe');
            }

            const ids = team.team.idUsers;
            try {
                return this.usersService.findUsersByIds(ids);
            } catch (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            throw new Error(errorMessage);
        }
    }

    @Query((returns) => [User])
    async usersByTeamIds(@Args('teamIds', { type: () => [Int] }) teamIds: number[]) {
        console.log("[*] usersByTeams");
        console.log(teamIds);
        interface TeamResponse {
            teamsUsersIds: {
                userIds: number[];
            };
        }
        console.log("asd1");
        try {
            console.log("asd2");
            const variables = {
                ids: teamIds
            
            }

            const teamQuery = `
                query ($ids: [Int!]!) {
                    teamsUsersIds(ids: $ids) {
                        userIds
                    }
                }
            `;


            
            console.log("asd3");
            const usersIds: TeamResponse = await request('http://localhost:3002/graphql', teamQuery,variables);
            console.log("asd4");
            const ids = usersIds.teamsUsersIds.userIds;
            console.log("asd");
            try {
                return this.usersService.findUsersByIds(ids);
            } catch (error) {
                throw new Error(error.message);
            }
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            throw new Error(errorMessage);
        }

        
    }


    @Query((returns) => User)
    user(@Args('id', { type: () => Int }) id: number) {
        console.log("[*] user");
        return this.usersService.findUserById(id);
    }

    @Query((returns) => User)
    email(@Args('email', { type: () => String }) email: string) {
        console.log("[*] email");
        try {
            return this.usersService.findUserByEmail(email);
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
        }
    }

    @Query((returns) => [User])
    async usersByIds(@Args('ids', { type: () => [Int] }) ids: number[]) {
        console.log("[*] usersByIds");
        return this.usersService.findUsersByIds(ids);
    }

    @Mutation((returns) => ResponseUser)
    async register(@Args('userInput') userInput: RegisterUserInput) {
        console.log("[*] register");
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
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
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
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
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
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
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
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
        }
    }

    @Mutation((returns) => User)
    async login(@Args('loginInput') loginInput: LoginUserInput) {
        console.log("[*] login");
        try {
            return await this.usersService.login(loginInput);
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
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
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
        }
    }

    @Mutation((returns) => ResponseUser)
    async deleteUser(@Args('deleteUserInput') deleteUserInput: DeleteUserInput) {
        console.log("[*] deleteUser");

        interface TeamResponse {
            kickUserAllTeams: {
                response: boolean;
            };
        }

        try {

            const teamMutation = `
                mutation ($idUser: Int!) {
                    kickUserAllTeams(kickUserAllTeamsInput:{
                        idUser: $idUser
                    }) {
                        response
                    }
                }
            `;

            const variables = {
                idUser: deleteUserInput.idUser
            };
            const validateTeam: TeamResponse = await request('http://localhost:3002/graphql', teamMutation, variables);

            if (!validateTeam.kickUserAllTeams.response) {
                return { response: false };
            } else {
                try {
                    const validate = await this.usersService.deleteUser(deleteUserInput);
                    if (validate) {
                        return { response: true };
                    } else {
                        return { response: false };
                    }
                } catch (error) {
                    throw new Error(error.message);
                }
            }

        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            throw new Error(errorMessage);
        }
    }

    @Mutation((returns) => ResponseUser)
    async addRoleUser(@Args('addRoleUserInput') addRoleUserInput: AddRoleUserInput) {
        console.log("[*] addRoleUser");
        try {
            const validate = await this.usersService.addRoleUser(addRoleUserInput.idUser, addRoleUserInput.idRole);
            if (validate) {
                return { response: true };
            } else {
                return { response: false };
            }
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
        }
    }

    @Mutation((returns) => ResponseUser)
    async removeRoleUser(@Args('removeRoleUserInput') removeRoleUserInput: RemoveRoleUserInput) {
        console.log("[*] removeRoleUser");
        try {
            const validate = await this.usersService.removeRoleUser(removeRoleUserInput.idUser);
            if (validate) {
                return { response: true };
            } else {
                return { response: false };
            }
        } catch (error) {
            const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
            if (errorMessage === 'Error desconocido') {
                throw new Error(error.message);
            }
            throw new Error(errorMessage);
        }
    }

    @ResolveField((returns) => Role)
    async role(@Parent() user: User): Promise<Role | null> {
        if (user.role) {
            const role = await this.rolesService.findRoleById(user.role.id);
            return role;
        }
        return null;
    }
}
