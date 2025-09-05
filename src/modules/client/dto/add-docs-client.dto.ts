import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional } from 'class-validator';


export class addDocsClientDTO {
    @IsString() @ApiProperty({ example: 'id актёра' }) actorId: string;
    @IsString() @ApiProperty({ example: 'id клиента' }) clientId: string;
    @IsString() @ApiProperty({ example: 'код документа' }) code: string;
    @IsString() @ApiProperty({ example: 'название документа' }) title: string;
    @IsOptional() @IsString() @ApiProperty({ example: 'редакция' }) versionLabel?: string;
    @IsOptional() @IsString() @ApiProperty({ example: 'fileUrl' }) fileUrl?: string;
  }
