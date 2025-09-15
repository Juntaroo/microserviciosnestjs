import { 
  Body, 
  Controller, 
  Delete, 
  Get, 
  Inject, 
  Param, 
  Patch, 
  Post, 
  HttpException,
  Query
 } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from 'src/clients/clients.controller';
import { CreateInvoiceDto } from 'src/common/dtos/create-invoice-dto';
import { UpdateInvoiceDto } from 'src/common/dtos/update-invoice-dto';
import { PaginationDto } from 'src/common';

@Controller('invoices')
export class InvoicesController {
    constructor(
        @Inject('MS_INVOICE') private readonly invoicesClient: ClientProxy,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createInvoice(@Body() dto: CreateInvoiceDto) {
    return this.invoicesClient.send('createInvoice', dto).pipe(
      catchError(err =>
        throwError(() => new HttpException(
          err?.message ?? 'Error inesperado en microservicio',
          err?.status ?? 500,
        )),
      ),
    );
  }

    @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
    @Get()
    findAllInvoices(@Query() pagination: PaginationDto) {
    return this.invoicesClient.send('findAllInvoice', pagination).pipe(
      catchError(err =>
        throwError(() => new HttpException(
          err?.message ?? 'Error al obtener facturas',
          err?.status ?? 500,
        )),
      ),
    );
  }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.invoicesClient.send('findOneInvoice', id).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Factura no encontrada';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }

    @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
    @Patch(':id')
    patchInvoice(@Param('id') id: string, @Body() dto: UpdateInvoiceDto) {
    return this.invoicesClient.send('updateInvoice', { id, dto }).pipe(
      catchError(err =>
        throwError(() => new HttpException(
          err?.message ?? 'Error al actualizar factura',
          err?.status ?? 500,
        )),
      ),
    );
  }

    @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
    @Delete(':id')
    removeInvoice(@Param('id') id: string) {
        return this.invoicesClient.send('removeInvoice', id).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Error al eliminar factura';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }
}