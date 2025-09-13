import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {

  constructor(private _prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    return this._prisma.product.create({ data: createProductDto });
  }

  findAll() {
    return this._prisma.product.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number) {
    return this._prisma.product.findFirst({
      where: { id, deletedAt: null }
    });
  }

  async update(id: number, updateProductoDto: UpdateProductDto) {
    return this._prisma.product.update({
      where: { id },
      data: updateProductoDto
    });
  }

  async remove(id: number) {
    return this._prisma.product.update({
      where: { id },
      data: { active: false, deletedAt: new Date() },
    });
  }
}










/*
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  create(data: { name: string; description?: string; price: number; stock: number }) {
    return this.prisma.product.create({ data });
  }

  findAll() {
    return this.prisma.product.findMany();
  }

  findOne(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  update(id: number, data: Partial<{ name: string; description?: string; price: number; stock: number }>) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
*/


