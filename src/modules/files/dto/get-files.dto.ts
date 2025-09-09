import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsEnum, IsArray } from 'class-validator';
import { DocumentKind } from '@prisma/client';

export class GetFilesDTO {
  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  page?: number;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 10 })
  size?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({ example: [1, 2] })
  tagIds?: string[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({ example: [1, 2] })
  categoryIds?: string[];

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'ru' })
  language?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  typeId?: string;

  @IsOptional()
  @IsNumber()
  @ApiPropertyOptional({ example: 1 })
  statusId?: string;

  @IsOptional()
  @IsEnum(DocumentKind)
  @ApiPropertyOptional({ enum: DocumentKind })
  documentKind?: DocumentKind;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'uuid-original' })
  originalDocumentId?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'createdAt' })
  orderBy?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'desc' })
  orderDirection?: 'asc' | 'desc';
}