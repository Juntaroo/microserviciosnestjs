import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsPositive, IsOptional, IsDate } from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsNumber()
  @IsPositive()
  id: number;

   @IsOptional()
  password?: string;

  @IsOptional()
  @IsDate()
  deletedAt?: Date;
}




//import { PartialType } from '@nestjs/mapped-types';
/*import { CreateUserDto } from './create-user.dto';
import { IsNumber, IsPositive } from 'class-validator';

//export class UpdateUserDto extends PartialType(CreateUserDto)
export class UpdateUserDto extends (CreateUserDto) {

    @IsNumber()
    @IsPositive()
    id: number;

}*/
