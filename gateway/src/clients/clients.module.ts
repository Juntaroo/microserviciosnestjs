import { Module } from '@nestjs/common';
import { UsersController } from './clients.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, USERS_SERVICE } from 'src/configuration';

@Module({
  controllers: [UsersController],
  providers: [],
  imports: [
    ClientsModule.register([
      {
        name: USERS_SERVICE,//Este string es para injectar este microservicio con el resto del proyecto
        transport: Transport.TCP,
        options: {
          host: envs.MS_USER_HOST,
          port: envs.MS_USER_PORT
        }
      }
    ]),
  ]
})
export class UsersModule { }


