import { Body, Controller, Delete, Get, Inject, Param, Patch, Post, HttpException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Controller('facturas')
export class InvoicesController {
    constructor(
        @Inject('invoices-ms') private readonly invoicesClient: ClientProxy,
    ) { }

    @Post()
    crearFactura(@Body() data: any) {
        return this.invoicesClient.send('createInvoice', data).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Error inesperado en microservicio';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }

    @Get()
    obtenerFacturas() {
        return this.invoicesClient.send('findAllInvoice', {}).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Error al obtener facturas';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }

    @Get(':id')
    obtenerFactura(@Param('id') id: string) {
        return this.invoicesClient.send('findOneInvoice', id).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Factura no encontrada';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }

    @Patch(':id')
    actualizarFactura(@Param('id') id: string, @Body() data: any) {
        return this.invoicesClient.send('updateInvoice', { id, data }).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Error al actualizar factura';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }

    @Delete(':id')
    eliminarFactura(@Param('id') id: string) {
        return this.invoicesClient.send('removeInvoice', id).pipe(
            catchError((err) => {
                const status = err?.status || 500;
                const message = err?.message || 'Error al eliminar factura';
                return throwError(() => new HttpException(message, status));
            }),
        );
    }
}


/*import { Controller, Post, Get, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ClientsService } from '../clients/clients.service';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { firstValueFrom } from 'rxjs';

@Controller('invoices')
@UseGuards(JwtAuthGuard)
export class InvoicesController {
  constructor(private readonly clients: ClientsService) {}

  @Post()
  async createInvoice(@Request() req, @Body() body: {
    items: { productId: number; quantity: number; unitPrice: number }[];
  }) {
    const userId = req.user.id;
    return firstValueFrom(
      this.clients.invoicesClient.send({ cmd: 'create-invoice' }, {
        userId,
        items: body.items,
      })
    );
  }

  @Get()
  async getAllInvoices() {
    return firstValueFrom(
      this.clients.invoicesClient.send({ cmd: 'get-invoices' }, {})
    );
  }

  @Get(':id')
  async getInvoice(@Param('id') id: string) {
    return firstValueFrom(
      this.clients.invoicesClient.send({ cmd: 'get-invoice' }, parseInt(id))
    );
  }
}
*/