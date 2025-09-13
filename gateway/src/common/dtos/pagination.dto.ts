/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Type } from "class-transformer";
import { IsBoolean, IsOptional, IsPositive } from "class-validator";

export class PaginationDto {
    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    page?: number = 1;

    @IsPositive()
    @IsOptional()
    @Type(() => Number)
    limit?: number = 10;

    @IsOptional()
    @IsBoolean()
    @Type(() => Boolean)
    withDeleted?:boolean = false;
}