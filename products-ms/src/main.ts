import { envs } from './configuration';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('products-ms main');

  
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {//Aca se configura el microservicio
      transport: Transport.TCP,//Le establezco el tipo
      options: {
        host: envs.HOST,
        port: envs.PORT
      }
    }
  );

  logger.log(`Products Microservice running on port: ${envs.PORT}`);
  await app.listen();
}
bootstrap();