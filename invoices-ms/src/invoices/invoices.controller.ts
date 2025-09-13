import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) { }

  @MessagePattern({cmd: 'create_invoice'})
  create(@Payload() createinvoiceDto: CreateInvoiceDto) {
    return this.invoicesService.create(createinvoiceDto);
  }

  @MessagePattern({cmd: 'findAll_invoice'})
  findAll() {
    return this.invoicesService.findAll();
  }

  @MessagePattern({cmd: 'findOne_invoice'})
  findOne(@Payload() id: string) {
    return this.invoicesService.findOne(id);
  }

  @MessagePattern({cmd: 'update_invoice'})
  update(@Payload() payload: { id: string; data: UpdateInvoiceDto }) {
    return this.invoicesService.update(payload);
  }

  @MessagePattern({cmd: 'remove_invoice'})
  remove(@Payload() id: string) {
    return this.invoicesService.remove(id);
  }
}




/*
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { InvoicesService } from './invoices.service';

@Controller()
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @MessagePattern({ cmd: 'create-invoice' })
  createInvoice(@Payload() data: {
    userId: number;
    items: { productId: number; quantity: number; unitPrice: number }[];
  }) {
    return this.invoicesService.createInvoice(data);
  }

  @MessagePattern({ cmd: 'get-invoices' })
  findAll() {
    return this.invoicesService.findAll();
  }

  @MessagePattern({ cmd: 'get-invoice' })
  findOne(@Payload() id: number) {
    return this.invoicesService.findOne(id);
  }
}
*/


