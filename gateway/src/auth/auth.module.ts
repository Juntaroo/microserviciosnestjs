import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from 'src/clients/clients.module'; // Para usar ClientProxy

@Module({
  imports: [
    UsersModule, //Accedemos al microservicio de usuarios
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY', //Secret para firmar JWT
      signOptions: { expiresIn: '1h' }, //Expiración del token
    }),
  ],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
