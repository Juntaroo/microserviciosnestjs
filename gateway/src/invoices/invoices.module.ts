import { Module } from '@nestjs/common';
import { InvoicesController } from './invoices.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { envs, FACTURA_SERVICE } from 'src/configuration';

@Module({
  controllers: [InvoicesController],
  imports: [
    ClientsModule.register([
      {
        name: FACTURA_SERVICE,//Este string es para injectar este microservicio con el resto del proyecto
        transport: Transport.TCP,
        options: {
          host: envs.MS_FACTURA_HOST,
          port: envs.MS_FACTURA_PORT
        }
      }
    ]),
  ],
})
export class InvoicesModule { }
