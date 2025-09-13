import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, PRODUCTS_SERVICE } from 'src/configuration';

@Module({
  controllers: [ProductsController],
  imports: [
    ClientsModule.register([
      {
        name: PRODUCTS_SERVICE,//Este string es para injectar este microservicio con el resto del proyecto
        transport: Transport.TCP,
        options: {
          host: envs.MS_PRODUCTS_HOST,
          port: envs.MS_PRODUCTS_PORT
        }
      }
    ]),
  ]
})
export class ProductsModule { }
