import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { ResponseRole, Role } from './entities/role.entity';
import { CreateRoleInput } from './dto/create-role.input';
import { UpdateRoleInput } from './dto/update-role.input';
import { DeleteRoleInput } from './dto/delete-role.input';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';

@Resolver(() => Role)
export class RoleResolver {
  constructor(
    private readonly roleService: RoleService,
    private readonly usersService: UsersService,
  ) { }

  @Query(() => [Role])
  roles() {
    console.log("[*] roles");
    return this.roleService.findAll();
  }

  @Query(() => Role)
  role(@Args('id', { type: () => Int }) id: number) {
    console.log("[*] role");
    return this.roleService.findRoleById(id);
  }

  @Mutation(() => Role)
  createRole(@Args('createRoleInput') createRoleInput: CreateRoleInput) {
    console.log("[*] createRole");
    try {
      return this.roleService.createRole(createRoleInput.name);
    } catch (error) {
      const errorMessage = error.response?.errors[0]?.message || 'Error desconocido';
      if (errorMessage === 'Error desconocido') {
        throw new Error(error.message);
      }
      throw new Error(errorMessage);
    }
  }

  @Mutation(() => ResponseRole)
  updateRole(@Args('updateRoleInput') updateRoleInput: UpdateRoleInput) {
    console.log("[*] updateRole");
    try {
      const validate = this.roleService.updateRole(updateRoleInput.idRole, updateRoleInput.name);
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

  @Mutation(() => ResponseRole)
  deleteRole(@Args('deleteRoleInput') deleteRoleInput: DeleteRoleInput) {
    console.log("[*] deleteRole");
    try {
      const validate = this.roleService.deleteRole(deleteRoleInput.idRole);
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

  @ResolveField((returns) => [User])
  async users(@Parent() role: Role): Promise<User[]> {
    const users = await this.usersService.findUsersByRole(role.id);
    console.log(users);
    return users;
  }

}
