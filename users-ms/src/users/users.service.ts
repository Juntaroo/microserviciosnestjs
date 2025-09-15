import { HttpStatus, Injectable, Logger, NotFoundException, Inject } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { CreateInvoiceDto, InvoiceItemDto } from './dto/create-invoice.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private prisma: PrismaService,
    @Inject('MS_PRODUCT') private readonly productClient: ClientProxy,
    @Inject('MS_INVOICE') private readonly invoiceClient: ClientProxy,
  ) {}

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

  //Actualizo el usuario
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
 async addToCart(userId: number, productId: number, quantity: number) {
  //Verificar stock del producto en ProductsService
  const product = await firstValueFrom(
    this.productClient.send({ cmd: 'find_one_product' }, { id: productId })
  );

  if (!product) {
    throw new RpcException({
      status: 404,
      message: `Producto con ID ${productId} no encontrado`,
    });
  }

  if ((product as any).stock < quantity) {
    throw new RpcException({
      status: 400,
      message: `Stock insuficiente para producto ${productId}`,
    });
  }

  //Guardar o actualizar en carrito usando upsert
  const cartItem = await this.prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    update: { quantity }, // actualizar cantidad si ya existe
    create: { userId, productId, quantity }, // crear si no existe
  });

  //Retornar carrito actualizado
  return cartItem;
}

   async checkoutCart(userId: number) {
  //Obtener carrito del usuario
  const cartItems = await this.prisma.cartItem.findMany({ where: { userId } });
  if (cartItems.length === 0) {
    return { message: 'Carrito vacío' };
  }

  //Validar stock y preparar items de factura
  const invoiceItems = await Promise.all(
    cartItems.map(async (item) => {
      const product = await firstValueFrom(
        this.productClient.send(
          { cmd: 'find_one_product' },
          { id: item.productId }
        )
      );

      if (!product || (product as any).stock < item.quantity) {
        throw new RpcException({
          status: 400,
          message: `Stock insuficiente para producto ${item.productId}`,
        });
      }

      return {
        productId: item.productId,
        descripcion: (product as any).productName,
        quantity: item.quantity,
        unitPrice: (product as any).price,
      };
    })
  );

  //Descontar stock en ProductsService
  for (const item of invoiceItems) {
    await firstValueFrom(
      this.productClient.send(
        { cmd: 'decrease_stock' },
        { id: item.productId, quantity: item.quantity }
      )
    );
  }

  //Obtener usuario
  const user = await this.prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    throw new RpcException({ status: 404, message: 'Usuario no encontrado' });
  }

  //Crear DTO de factura
  const invoiceDto: CreateInvoiceDto = {
    numero: `FAC-${Date.now()}`,
    userId: user.id,
    total: invoiceItems.reduce((acc, i) => acc + i.quantity * i.unitPrice, 0),
    items: invoiceItems,
  };

  //Crear factura en InvoicesService
  const invoice = await firstValueFrom(
    this.invoiceClient.send({ cmd: 'create_invoice' }, invoiceDto)
  );

  //Vaciar carrito
  await this.prisma.cartItem.deleteMany({ where: { userId } });

  //Devolver factura
  return invoice;
}
}