import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';

export class CreateClientDTO {
    @IsString() @ApiProperty({ example: 'id создателя' }) creatorId: string;
    @IsString() @ApiProperty({ example: 'название компании' }) name: string;
    @IsOptional() @IsString() @ApiProperty({ example: 'ИНН' }) inn?: string;
  }

export class UpdateClientDTO {
    @IsString() @ApiProperty({ example: 'id клиента' }) id: string;
    @IsOptional() @IsString() @ApiProperty({ example: 'название компании' }) name?: string;
    @IsOptional() @IsString() @ApiProperty({ example: 'ИНН' }) inn?: string;
}