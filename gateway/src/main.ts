import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './configuration';
import { ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true
    })
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter());

  console.info(`Gateway Microservice running on port: ${envs.PORT}`);
  await app.listen(envs.PORT);
}
bootstrap();