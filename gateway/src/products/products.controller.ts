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
  Query
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { RolesGuard } from 'src/clients/clients.controller';
import { UseGuards } from '@nestjs/common';
import { PaginationDto } from 'src/common';
import { CreateProductDto } from 'src/common/dtos/create-product-dto';
import { UpdateProductDto } from 'src/common/dtos/update-product-dto';

@Controller('productos')
export class ProductsController {
  constructor(
    @Inject('MS_PRODUCTS') private readonly productsClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Post()
  createProduct(@Body() createProductDto: CreateProductDto) {
    return this.productsClient.send('createProduct', createProductDto).pipe(
      catchError(err => throwError(() => new HttpException(err?.message ?? 'Error al crear producto', err?.status ?? 500))),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllProducts(@Query() pagination: PaginationDto) {
    return this.productsClient.send('findAllProducts', pagination).pipe(
      catchError(err => throwError(() => new HttpException(err?.message ?? 'Error al listar productos', err?.status ?? 500))),
    );
  }

  @UseGuards(JwtAuthGuard)
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

  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Patch(':id')
  patchProduct(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsClient.send('updateProduct', { id, dto: updateProductDto }).pipe(
      catchError(err => throwError(() => new HttpException(err?.message ?? 'Error al actualizar producto', err?.status ?? 500))),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Delete(':id')
  removeProduct(@Param('id') id: string) {
    return this.productsClient.send('removeProduct', id).pipe(
      catchError(err => throwError(() => new HttpException(err?.message ?? 'Error al eliminar producto', err?.status ?? 500))),
    );
  }
}
