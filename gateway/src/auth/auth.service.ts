/*import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {}
*/
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientsService } from '../clients/clients.service';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private clients: ClientsService,
    private jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await firstValueFrom(
      this.clients.usersClient.send({ cmd: 'validate-user' }, { email, password })
    );

    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { access_token: token };
  }

  async validateUserById(userId: number) {
    return firstValueFrom(
      this.clients.usersClient.send({ cmd: 'get-user-by-id' }, userId)
    );
  }
}
