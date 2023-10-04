import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import { LoginUserInput } from './dto/login-user.input';
import { AuthResponse } from './dto/auth-response.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService
    ) {}
/*
  @Mutation(() => AuthResponse)
  async login(@Args('input') input: LoginUserInput) {
      const user = await this.usersService.findUserByEmail(input.email);

      if (!user || user.password !== input.password) {
          throw new UnauthorizedException('Credenciales incorrectas');
      }

      const { accessToken } = await this.authService.generateToken(user.id);

      return { token: accessToken };
  }
*/
  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginUserInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    // Buscar al usuario por correo electrónico
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      throw new Error('Credenciales incorrectas');
    }

    // Si las credenciales son válidas, generar un token JWT
    const { accessToken } = await this.authService.generateToken(user.id);

    return { token: accessToken };
  }
}
