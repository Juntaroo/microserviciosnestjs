import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductsService {

  constructor(private prisma: PrismaService) { }

  async create(createProductDto: CreateProductDto) {
    return this.prisma.product.create({ data: createProductDto });
  }

  findAll() {
    return this.prisma.product.findMany({
      where: { deletedAt: null },
    });
  }

  async findOne(id: number) {
    return this.prisma.product.findFirst({
      where: { id, deletedAt: null }
    });
  }

  async update(id: number, updateProductoDto: UpdateProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: updateProductoDto
    });
  }

  async remove(id: number) {
    return this.prisma.product.update({
      where: { id },
      data: { active: false, deletedAt: new Date() },
    });
  }
}