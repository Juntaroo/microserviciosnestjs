import { Injectable } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';

@Injectable()
export class ClientsService {
  usersClient: ClientProxy;
  productsClient: ClientProxy;
  invoicesClient: ClientProxy;

  constructor() {
    this.usersClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 3001 },
    });

    this.productsClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 3002 },
    });

    this.invoicesClient = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { port: 3003 },
    });
  }
}
