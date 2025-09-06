import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsNumber } from 'class-validator';

export class CreateRoleDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    name: string

    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    description: string

}

export class UpdateRoleDTO extends CreateRoleDTO {
    @IsOptional()
    @IsString()
    @ApiProperty({example: '', required: true})
    roleId: string
}