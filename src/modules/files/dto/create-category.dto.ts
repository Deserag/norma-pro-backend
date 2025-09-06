import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateCategoryDTO {
  @IsString()
  @ApiProperty({ example: 'Category Name', required: true })
  name: string;
}