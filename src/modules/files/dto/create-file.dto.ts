import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
} from 'class-validator';
import { DocumentKind } from '@prisma/client';

export class CreateFileDTO {
  @IsString()
  @ApiProperty({ example: 'DOC-001', required: true })
  code: string;

  @IsString()
  @ApiProperty({ example: 'Document Title', required: true })
  title: string;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  typeId: number;

  @IsNumber()
  @ApiProperty({ example: 1, required: true })
  statusId: number;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'Document description' })
  description?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'uuid-original' })
  originalDocumentId?: string;

  @IsOptional()
  @IsEnum(DocumentKind)
  @ApiPropertyOptional({ enum: DocumentKind, default: 'ORIGINAL' })
  documentKind?: DocumentKind;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({ example: 'ru' })
  language?: string;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({ example: [1, 2] })
  tagIds?: number[];

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  @ApiPropertyOptional({ example: [1, 2] })
  categoryIds?: number[];
}

export class UpdateFileDTO extends CreateFileDTO {
  @ApiProperty()
  @IsString()
  @ApiProperty({ example: 'DOC-001', required: true })
  fileId: string;
}
