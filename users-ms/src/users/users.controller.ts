import { Controller, ParseIntPipe } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/common';

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
}