import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  HttpException,
  Inject,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';

@Controller('productos')
export class ProductsController {
  constructor(
    @Inject('MS_PRODUCTS') private readonly productsClient: ClientProxy,
  ) {}

  @Post()
  createProduct(@Body() dto: any) {
    return this.productsClient.send('createProduct', dto).pipe(
      catchError((err) =>
        throwError(
          () =>
            new HttpException(err?.message ?? 'Error al crear producto', err?.status ?? 500),
        ),
      ),
    );
  }

  @Get()
  findAllProducts() {
    return this.productsClient.send('findAllProducts', {}).pipe(
      catchError((err) =>
        throwError(
          () =>
            new HttpException(err?.message ?? 'Error al listar productos', err?.status ?? 500),
        ),
      ),
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsClient.send('findOneProduct', id).pipe(
      catchError((err) =>
        throwError(
          () =>
            new HttpException(err?.message ?? `Producto ${id} no encontrado`, err?.status ?? 404),
        ),
      ),
    );
  }

  @Patch(':id')
  patchProducto(@Param('id') id: string, @Body() dto: any) {
    return this.productsClient.send('updateProduct', { id, dto }).pipe(
      catchError((err) =>
        throwError(
          () =>
            new HttpException(err?.message ?? 'Error al actualizar producto', err?.status ?? 500),
        ),
      ),
    );
  }

  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productsClient.send('removeProduct', id).pipe(
      catchError((err) =>
        throwError(
          () =>
            new HttpException(err?.message ?? 'Error al eliminar producto', err?.status ?? 500),
        ),
      ),
    );
  }
}
