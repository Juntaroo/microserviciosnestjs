import { Controller, Post, Get, Patch, Delete, Body, Param, HttpException, Inject, UseGuards } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, throwError } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('usuarios')
export class UsersController {
  constructor(
    @Inject('MS_USER') private readonly userClient: ClientProxy,
  ) {}

  @Post()
  createUser(@Body() dto: any) {
    return this.userClient.send('createUser', dto).pipe(
      catchError((err) =>
        throwError(() =>
          new HttpException(err?.message ?? 'Error al crear usuario', err?.status ?? 500),
        ),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAllUsers() {
    return this.userClient.send('findAllUsers', {}).pipe(
      catchError((err) =>
        throwError(() =>
          new HttpException(err?.message ?? 'Error al listar usuarios', err?.status ?? 500),
        ),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userClient.send('findOneUser', id).pipe(
      catchError(() =>
        throwError(() =>
          new HttpException(`Usuario ${id} no encontrado`, 404),
        ),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  patchUser(@Param('id') id: string, @Body() dto: any) {
    return this.userClient.send('updateUser', { id, dto }).pipe(
      catchError((err) =>
        throwError(() =>
          new HttpException(err?.message ?? 'Error al actualizar usuario', err?.status ?? 500),
        ),
      ),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  removeUser(@Param('id') id: string) {
    return this.userClient.send('removeUser', id).pipe(
      catchError((err) =>
        throwError(() =>
          new HttpException(err?.message ?? 'Error al eliminar usuario', err?.status ?? 500),
        ),
      ),
    );
  }
}
