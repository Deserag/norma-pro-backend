import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class getClientDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    clientId: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    name: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    inn: string

    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 1, required: true})
    page: 5

    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 10, required: true})
    size: 10

    @IsOptional()
    @IsBoolean()
    @ApiProperty({example: 10, required: true})
    deletedAt:  null
}

export class getUsersListClientDTO {
    @IsString() @ApiProperty({ example: 'id клиента' }) clientId: string;
    @IsOptional() @IsNumber() @ApiProperty({ example: 1 }) page?: number;
    @IsOptional() @IsNumber() @ApiProperty({ example: 10 }) size?: number;
    deletedAt;
    name;
    companyId

}
  