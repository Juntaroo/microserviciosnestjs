import { IsString, IsNumber, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateProductDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsNumber()
    price: number;
    
    @IsNumber()
    stock: number;

    @IsBoolean()
    active: boolean;  
}
