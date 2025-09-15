import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';
import { firstValueFrom } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @MessagePattern({ cmd: 'create_user' } )//Creo el usuario hasheado
  create(@Payload() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  
  @MessagePattern({ cmd: 'find_all_users'} )//Lista los usuarios con paginacion
  findAll(@Payload() paginationDto: PaginationDto) {
    return this.usersService.findAll(paginationDto);
  }

  
  @MessagePattern({ cmd: 'find_one_user' })//Busca el usuario por id
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.usersService.findOne(id);
  }

  
  @MessagePattern({cmd: 'update_user'} )//Actualiza el usuario
  update(@Payload() updateUserDto: UpdateUserDto) {
    return this.usersService.update(updateUserDto.id, updateUserDto);
  }

  
  @MessagePattern({cmd: 'delete_user'} )//Elimina al usuario por id
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }

  //Carrito: exponer endpoints del microservicio de users
  @MessagePattern({ cmd: 'add_to_cart' })
  addToCart(
    @Payload() payload: { userId: number; productId: number; quantity: number },
  ) {
    return this.usersService.addToCart(
      payload.userId,
      payload.productId,
      payload.quantity,
    );
  }

  @MessagePattern({ cmd: 'checkout_cart' })
  checkoutCart(@Payload('userId') userId: number) {
    return this.usersService.checkoutCart(userId);
  }
}