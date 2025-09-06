import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetTagsDTO {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 10 })
  size?: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'construction' })
  tagType?: string;
}