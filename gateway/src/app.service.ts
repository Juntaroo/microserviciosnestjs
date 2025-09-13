import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Observable } from 'rxjs';

@Injectable()
export class AppService implements OnModuleInit {
  private readonly logger = new Logger(AppService.name);

  constructor(
    @Inject('MS_USER') private readonly userClient: ClientProxy,
    @Inject('MS_PRODUCTS') private readonly productsClient: ClientProxy,
  ) {}

  async onModuleInit() {
    try {
      await this.userClient.connect();
      this.logger.log('🟢 Conectado con el microservicio de usuarios');
      await this.productsClient.connect();
      this.logger.log('🟢 Conectado con el microservicio de productos');
    } catch (error) {
      this.logger.error('🔴 Error al conectar con microservicios', error);
    }
  }

  getHello(): string {
    return 'Hello World!';
  }

  private sendMessage(client: ClientProxy, pattern: string, data: any): Observable<any> {
    this.logger.debug(`Enviando mensaje -> pattern: ${pattern}, data: ${JSON.stringify(data)}`);
    return client.send(pattern, data);
  }

  getUsers(): Observable<any> {
    return this.sendMessage(this.userClient, 'find_all_users', { page: 1, limit: 10 });
  }

  getProducts(): Observable<any> {
    return this.sendMessage(this.productsClient, 'find_all_products', { page: 1, limit: 10 });
  }
}



