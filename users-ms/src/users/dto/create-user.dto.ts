import { IsString, IsEmail, MinLength, IsOptional, IsBoolean, IsDate } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  name: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @IsOptional()
  @IsDate()
  deletedAt?: Date; 
}



// src/user/dto/create-user.dto.ts
/*import { IsString, IsOptional, IsBoolean } from 'class-validator';

export class CreateUserDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}*/
