import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
      logging: true,
    });
  }

  async validate(payload: any) {
    // Aquí puedes realizar validaciones adicionales o cargar información del usuario según el payload del token.
    // Por ejemplo, puedes buscar el usuario en la base de datos utilizando el servicio UsersService.

    console.log(payload.sub);

    const user = await this.usersService.findUserById(payload.sub);

    console.log(user);

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    return user;
  }
}