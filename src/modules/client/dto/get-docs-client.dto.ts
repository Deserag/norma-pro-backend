import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsArray, ArrayNotEmpty } from 'class-validator';

export class getDocsClientDTO {
   deletedAt;
   title;
   size;
   page;
   companyId

  }