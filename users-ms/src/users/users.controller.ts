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




/*import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { UsersService } from './users.service';
import { PaginationDto } from 'src/common/dto/pagination-dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @MessagePattern('create_user')
  create(@Payload() createUserDto: CreateUserDto) {
    //return this.usersService.create(createUserDto);
  }//Crea un usuario con los datos recibidos

  @MessagePattern({ cmd: 'get-user-by-email' })
  getUserByEmail(email: string) {
    return this.usersService.findByEmail(email);
  }//Busca al usuario a traves del email

  @MessagePattern({ cmd: 'validate-user' })
  validateUser(data: { email: string; password: string }) {
    return this.usersService.validateUser(data.email, data.password);
  }//Valida si el usuario existe y si la contraserña coincide

  @MessagePattern({ cmd: 'get-user-by-id' })
  getUserById(id: number) {
    return this.usersService.findById(id);
  }//Busca al usuario a traves del id
}*/
