import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDate,
  IsOptional,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateOrderClientDTO {
  @IsString()
  @ApiProperty({ example: 'id актёра (тот кто создаёт)' })
  actorId: string;
  @IsString() @ApiProperty({ example: 'id клиента' }) clientId: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'описание заказа' })
  description?: string;
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ApiProperty({ example: [{ documentId: '...', versionId: '...' }] })
  items?: Array<{ documentId: string; versionId?: string; price?: number }>;
  companyId;
  amount;
  statusId;
}

export class UpdateOrderClientDTO {
  @IsString() @ApiProperty({ example: 'id заказа' }) id: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'описание' })
  description?: string;
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'statusId' })
  statusId?: string;
}
