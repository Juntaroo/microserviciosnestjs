import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Controller('invoices')
export class InvoicesController {
    constructor(
        @Inject('MS_INVOICE') private readonly invoicesClient: ClientProxy,
    ) { }

    @Post()
    createInvoice(@Body() data: any) {
        return this.invoicesClient.send('createInvoice', data).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Error inesperado en microservicio';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }

    @Get()
    findAllInvoices() {
        return this.invoicesClient.send('findAllInvoice', {}).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Error al obtener facturas';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }

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

    @Patch(':id')
    patchInvoice(@Param('id') id: string, @Body() data: any) {
        return this.invoicesClient.send('updateInvoice', { id, data }).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Error al actualizar factura';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }

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