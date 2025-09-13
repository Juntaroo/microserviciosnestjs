import { Injectable, UnauthorizedException, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @Inject('MS_USER') private readonly userClient: ClientProxy,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    // Llamamos al microservicio de usuarios
    const user = await firstValueFrom(
      this.userClient.send('validateUser', { email, password })
    );

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    return user; // Retornamos el usuario validado
  }

  async login(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
