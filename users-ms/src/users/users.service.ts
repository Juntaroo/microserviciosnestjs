import { HttpStatus, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService) {}

  //Creo al usuario con contraseña hasheada
  async create(createUserDto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    return this.prisma.user.create({
      data: {
        email: createUserDto.email,
        password: hashedPassword,
        name: createUserDto.name,
        role: createUserDto.role,
      },
    });
  }

  //Para listar a los usuarios con paginacion
  async findAll(paginationDto: PaginationDto) {
    this.logger.log('service findAll', paginationDto);

    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'asc' },
        where: paginationDto.withDeleted
          ? {} //Incluye todos, incluso eliminados
          : { deletedAt: null }, //Solo toma activos
      }),
      this.prisma.user.count({
        where: paginationDto.withDeleted ? {} : { deletedAt: null },
      }),
    ]);

    return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  //Se busca el usuario por id
  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new RpcException({
        message: `Usuario con ID ${id} no encontrado`,
        status: HttpStatus.NOT_FOUND,
      });
    }

    return user;
  }

  //Actualizo el usuarioo
  async update(id: number, updateUserDto: UpdateUserDto) {
    //Si viene password en el DTO, se hashea
    let data = { ...updateUserDto };
    if (updateUserDto.password) {
      data.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }
  }

  //Eliminar usuario mediante softdelete
  async remove(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    //En prisma se debe actualizar el campo deletedAt para que sea un softdelete
    return this.prisma.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}


























/*import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}



  async createUser(data: { email: string; password: string; name: string; role: string }) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        name: data.name,
        role: data.role,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  }
}
*/
