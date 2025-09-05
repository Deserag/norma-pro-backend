import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';

export class getClientDTO {
    @IsOptional() @IsNumber() @ApiProperty({ example: 1 }) page?: number;
    @IsOptional() @IsNumber() @ApiProperty({ example: 10 }) size?: number;
    @IsOptional() @IsString() @ApiProperty({ example: 'часть имени' }) q?: string;
}

export class getUsersListClientDTO {
    @IsString() @ApiProperty({ example: 'id клиента' }) clientId: string;
    @IsOptional() @IsNumber() @ApiProperty({ example: 1 }) page?: number;
    @IsOptional() @IsNumber() @ApiProperty({ example: 10 }) size?: number;
}
  