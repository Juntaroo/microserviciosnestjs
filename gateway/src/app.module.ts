import { Module } from '@nestjs/common';
import { UsersModule } from './clients/clients.module';
import { ProductsModule } from './products/products.module';
import { InvoicesModule } from './invoices/invoices.module';

@Module({
  imports: [
    UsersModule,
    ProductsModule,
    InvoicesModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}




/*import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { ClientsModule } from './clients/clients.module';
import { AuthModule } from './auth/auth.module';
import { ProductsController } from './products/products.controller';
import { InvoicesController } from './invoices/invoices.controller';

@Module({
  imports: [ClientsModule, AuthModule,  ConfigModule.forRoot({ isGlobal: true }),],
  controllers: [AppController, ProductsController, InvoicesController],
  providers: [AppService],
})
export class AppModule {}
*/