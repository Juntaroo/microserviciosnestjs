import { IsString, IsInt, IsNumber } from 'class-validator';

export class CreateItemDto {
    @IsString()
    descripcion: string;

    @IsInt()
    quantity: number;

    @IsNumber()
    unitPrice: number;
}
