import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class GetUserDocsDTO {
    @ApiProperty({ example: 'id пользователя' })
    @IsNotEmpty()
    @IsString()
    userId: string

    @ApiProperty({ example: 'id тип документа' })
    @IsString()
    typeId: string

    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 1, required: true})
    page: 5
    
    @IsOptional()
    @IsNumber()
    @ApiProperty({example: 10, required: true})
    size: 10
}