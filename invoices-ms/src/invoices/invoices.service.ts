import { Injectable } from '@nestjs/common';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class InvoicesService {
  constructor(private _prisma: PrismaService) { }

  create(createInvoiceDto: CreateInvoiceDto) {
    return this._prisma.invoice.create({
      data: {
        numero: createInvoiceDto.numero,
        userId: createInvoiceDto.userId,
        total: createInvoiceDto.total,
        items: {
          create: createInvoiceDto.items,
        },
      },
      include: { items: true },
    });
  }

  findAll() {
    return this._prisma.invoice.findMany({
      include: { items: true },
    });
  }

  async findOne(id: string) {
    const invoice = await this._prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!invoice) {
      throw new RpcException({ status: 404, message: `Factura con ID ${id} no encontrada` });
    }

    return invoice;
  }

  async update(payload: { id: string; data: UpdateInvoiceDto }) {
    const { id, data } = payload;

    // Validar que la factura exista
    const invoiceExistente = await this._prisma.invoice.findUnique({ where: { id } });

    if (!invoiceExistente) {
      throw new RpcException({ status: 404, message: `Factura con ID ${id} no encontrada` });
    }

    // Eliminar ítems previos
    await this._prisma.item.deleteMany({ where: { invoiceId: id } });

    // Actualizamos la factura
    await this._prisma.invoice.update({
      where: { id },
      data: {
        numero: data.numero,
        userId: data.userId,
        total: data.total,
      },
    });

    // Insertamos los nuevos items
    if (data.items?.length) {
      for (const item of data.items) {
        await this._prisma.item.create({
          data: {
            descripcion: item.descripcion,
            quantity : item.quantity,
            unitPrice: item.unitPrice,
            invoiceId: id,
          },
        });
      }
    }

    // Retornamos la factura actualizada con los nuevos items
    return this._prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
  }

  async remove(id: string) {
    const invoice = await this._prisma.invoice.findUnique({ where: { id } });

    if (!invoice) {
      throw new RpcException({ status: 404, message: `Factura con ID ${id} no encontrada` });
    }

    await this._prisma.item.deleteMany({ where: { invoiceId: id } });
    return this._prisma.invoice.delete({ where: { id } });
  }
}


/*
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class InvoicesService {
  constructor(private prisma: PrismaService) {}

  async createInvoice(data: {
    userId: number;
    items: { productId: number; quantity: number; unitPrice: number }[];
  }) {
    const total = data.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);

    return this.prisma.invoice.create({
      data: {
        userId: data.userId,
        total,
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: { items: true },
    });
  }

  findAll() {
    return this.prisma.invoice.findMany({
      include: { items: true },
    });
  }

  findOne(id: number) {
    return this.prisma.invoice.findUnique({
      where: { id },
      include: { items: true },
    });
  }
}
*/

