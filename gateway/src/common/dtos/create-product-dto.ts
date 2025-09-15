import { IsString, IsNumber, Min } from 'class-validator';

export class CreateProductDto {
  @IsString()
  productName: string;

  @IsNumber()
  @Min(0)
  price: number;

  @IsString()
  description?: string;
}