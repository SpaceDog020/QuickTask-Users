import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginUserInput } from './dto/login-user.input';
import { AuthResponse } from './dto/auth-response.dto';

@Resolver()
export class AuthResolver {
  constructor(
    private readonly authService: AuthService,
    ) {}

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginUserInput): Promise<AuthResponse> {
    const { email, password } = loginInput;

    // Buscar al usuario por correo electrónico
    const user = await this.authService.validateUser(email, password);

    if (!user) {
      return {response: false, accessToken: "" , name: ""};
    }

    // Si las credenciales son válidas, generar un token JWT
    const { accessToken } = await this.authService.generateToken(user.id);
    return { response: true, accessToken , name: user.name};
  }
}
