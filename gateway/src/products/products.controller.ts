import { Body, Controller, Delete, Get, Inject, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common';

@Controller('products')
export class ProductsController {
    constructor(
        @Inject('products-ms') private readonly productsClient: ClientProxy
    ) { }

    @Post()
    createProduct(@Body() data) {
        return this.productsClient.send('create_product', data).pipe(
            catchError((error) => {
                throw new RpcException(error); // Lanza la excepción para que el cliente la maneje
            })
        );
    }

    @Get()
    findAllProducts(@Query() PaginationDto: PaginationDto)/* : Observable<any> */ {
        return this.productsClient.send('find_all_products', PaginationDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsClient.send('find_one_product', id).pipe(
            catchError((error) => {
                throw new RpcException(error); // Lanza la excepción para que el cliente la maneje
            })
        );
    }

    @Delete(':id')
    removeProducto(@Param('id', ParseIntPipe) id: number) {
        return this.productsClient.send('remove_product', id).pipe(
            catchError((error) => {
                throw new RpcException(error); // Lanza la excepción para que el cliente la maneje
            })
        );
    }

    @Patch(':id')
    patchProducto(@Param('id', ParseIntPipe) id: number, @Body() updateProductoDto) {
        return this.productsClient.send('update_product', { id, updateProductoDto }).pipe(
            catchError((error) => {
                throw new RpcException(error); // Lanza la excepción para que el cliente la maneje
            })
        );
    }
}



/*
import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { firstValueFrom } from 'rxjs';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private clients: ClientsService) {}

  @Get()
  async getAll() {
    return firstValueFrom(
      this.clients.productsClient.send({ cmd: 'get-products' }, {})
    );
  }

  @Post()
  async create(@Body() body) {
    return firstValueFrom(
      this.clients.productsClient.send({ cmd: 'create-product' }, body)
    );
  }
}
*/


