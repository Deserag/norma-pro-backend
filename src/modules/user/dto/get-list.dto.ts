import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class GetListDTO {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: '', required: true })
  clientId: string;

  @IsOptional()
  @IsString()
  @ApiProperty({ example: '', required: true })
  name: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  page: 5;

  @IsOptional()
  @IsNumber()
  @ApiProperty({ example: 10, required: true })
  size: 10;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({ example: 1, required: true })
  deleted: false;
}
