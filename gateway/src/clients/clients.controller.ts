import { Controller, Post, Get, Patch, Delete, Body, Param, HttpException, Inject, UseGuards, Req, Injectable, Query } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { PaginationDto } from 'src/common';
import { CreateUserDto } from 'src/common/dtos/create-user-dto';
import { UpdateUserDto } from 'src/common/dtos/update-user.dto';

// Guard dinámico de roles
export const RolesGuard = (requiredRoles: string[]) => {
  @Injectable()
  class RoleGuardMixin {
    canActivate(context: any): boolean {
      const req = context.switchToHttp().getRequest();
      const userRoles: string[] = req.user?.roles || [];
      return requiredRoles.some(role => userRoles.includes(role));
    }
  }
  return RoleGuardMixin;
};

@Controller('usuarios')
export class UsersController {
  constructor(
    @Inject('MS_USER') private readonly userClient: ClientProxy,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Post()
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.userClient.send('createUser', createUserDto).pipe(
      catchError((err) => throwError(() => new HttpException(err?.message ?? 'Error al crear usuario', err?.status ?? 500))),
    );
  }

  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Get()
   findAllUsers(@Query() pagination: PaginationDto) {
    return this.userClient.send('findAllUsers', pagination).pipe(
      catchError((err) => throwError(() => new HttpException(err?.message ?? 'Error al listar usuarios', err?.status ?? 500))),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    //Solo ADMIN o el mismo usuario
    if (req.user.sub !== +id && !req.user.roles?.includes('ADMIN')) {
      throw new HttpException('No autorizado', 403);
    }
    return this.userClient.send('findOneUser', id).pipe(
      catchError(() => throwError(() => new HttpException(`Usuario ${id} no encontrado`, 404))),
    );
  }

   @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Req() req) {
    if (req.user.sub !== +id && !req.user.roles?.includes('ADMIN')) {
      throw new HttpException('No autorizado', 403);
    }
    return this.userClient.send('updateUser', { id, dto: updateUserDto }).pipe(
      catchError(err => throwError(() => new HttpException(err?.message ?? 'Error al actualizar usuario', err?.status ?? 500))),
    );
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userClient.send('removeUser', id).pipe(
      catchError(err =>
        throwError(() => new HttpException(err?.message ?? 'Error al eliminar usuario', err?.status ?? 500)),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Post('carrito/agregar')
  addToCart(@Req() req, @Body() body: { productId: number; quantity: number }) {
    //userId del JWT
    const userId = req.user.sub;

    return this.userClient
      .send('add_to_cart', {
        userId,
        productId: body.productId,
        quantity: body.quantity,
      })
      .pipe(
        catchError((err) =>
          throwError(
            () =>
              new HttpException(
                err?.message ?? 'Error al agregar al carrito',
                err?.status ?? 500,
              ),
          ),
        ),
      );
  }
  //POST /usuarios/carrito/agregar con { "productId": 1, "quantity": 2 } (token en Authorization header)

  @UseGuards(JwtAuthGuard)
  @Post('carrito/checkout')
  checkout(@Req() req) {
    const userId = req.user.sub;

    return this.userClient.send('checkout_cart', { userId }).pipe(
      catchError((err) =>
        throwError(
          () =>
            new HttpException(
              err?.message ?? 'Error al realizar compra',
              err?.status ?? 500,
            ),
        ),
      ),
    );
  }
  //POST /usuarios/carrito/checkout para finalizar la compra

   @UseGuards(JwtAuthGuard, RolesGuard(['ADMIN']))
  @Get('admin/all-users')
  getAllUsersForAdmin() {
    return this.userClient.send('findAllUsers', {}).pipe(
      catchError(err =>
        throwError(() => new HttpException(err?.message ?? 'Error al listar usuarios', err?.status ?? 500))
      )
    );
  }
}
