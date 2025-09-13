import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { RpcException } from '@nestjs/microservices';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UpdateInvoiceDto } from './dto/update-invoice.dto';

@Injectable()
export class InvoicesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateInvoiceDto) {
    try {
      const factura = await this.prisma.invoice.create({
        data: {
          numero: data.numero,
          userId: data.userId,
          total: data.total,
          items: { create: [...data.items] },
        },
        include: { items: true },
      });
      return factura;
    } catch (err) {
      throw new RpcException({ status: 400, message: 'Error al crear la factura' });
    }
  }

  async findAll() {
    return this.prisma.invoice.findMany({
      include: { items: true },
    });
  }

  async findOne(invoiceId: string) {
    const factura = await this.prisma.invoice.findUnique({
      where: { id: invoiceId },
      include: { items: true },
    });

    if (!factura) {
      throw new RpcException({
        status: 404,
        message: `No existe una factura con ID: ${invoiceId}`,
      });
    }

    return factura;
  }

  async update(payload: { id: string; data: UpdateInvoiceDto }) {
      const { id: invoiceId, data: dto } = payload;

      const existente = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });

      if (!existente) {
        throw new RpcException({
          status: 404,
          message: `No se encontró la factura con ID: ${invoiceId}`,
        });
      }

      await this.prisma.item.deleteMany({ where: { invoiceId } });

      await this.prisma.invoice.update({
        where: { id: invoiceId },
        data: {
        numero: dto.numero,
        total: dto.total,
        userId: dto.userId,
      },
      });

      if (dto.items?.length) {
        await this.prisma.item.createMany({
          data: dto.items.map((it) => ({
            descripcion: it.descripcion,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            invoiceId,
          })),
        });
      }

      return this.prisma.invoice.findUnique({
        where: { id: invoiceId },
        include: { items: true },
      });
  }

  async remove(invoiceId: string) {
    const existente = await this.prisma.invoice.findUnique({ where: { id: invoiceId } });

    if (!existente) {
      throw new RpcException({
        status: 404,
        message: `Factura con ID ${invoiceId} no encontrada`,
      });
    }

    await this.prisma.item.deleteMany({ where: { invoiceId } });
    return this.prisma.invoice.delete({ where: { id: invoiceId } });
  }
}
