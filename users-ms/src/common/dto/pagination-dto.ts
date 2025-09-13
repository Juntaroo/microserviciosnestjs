import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    //Es opcional que se mande, debe ser mayor a 0 y le establezco el tipo a number
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    page?: number = 1;//Por defecto que empiece en la pagina 1

    //Es opcional que se mande, debe ser mayor a 0 y le establezco el tipo a number
    @IsOptional()
    @IsPositive()
    @Type(() => Number)
    limit?: number = 10;//Establezco un limite por pagina de 10
    
    //Es opcional que se mande, le establezco tipo booleano
    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    withDeleted?:boolean = false;//Esto es para hacer un softdelete
}