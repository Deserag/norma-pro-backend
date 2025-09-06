import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class GetCategoriesDTO {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 10 })
  size?: number;
}