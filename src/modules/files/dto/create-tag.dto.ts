import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsNumber } from 'class-validator';

export class CreateTagDTO {
  @IsString()
  @ApiProperty({ example: 'Tag Name', required: true })
  name: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'construction' })
  tagType?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({ example: [1, 2] })
  categoryIds?: string[];
}