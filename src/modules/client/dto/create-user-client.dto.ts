import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsDate, IsOptional, IsIn } from 'class-validator';

export class CreateUserClientDTO {
    @IsString() @ApiProperty({ example: 'id актёра (тот кто создаёт)' }) actorId: string;
    @IsString() @ApiProperty({ example: 'id клиента' }) clientId: string;
    @IsString() @ApiProperty({ example: 'id пользователя' }) userId: string;
    @IsIn(['USER','MANAGER','ADMIN']) @ApiProperty({ example: 'MANAGER' }) role: 'USER' | 'MANAGER' | 'ADMIN';
  }

export class UpdateUserClientDTO {
    @IsString() @ApiProperty({ example: 'id membership' }) id: string;
    @IsOptional() @IsIn(['USER','MANAGER','ADMIN']) @ApiProperty({ example: 'MANAGER' }) role?: 'USER' | 'MANAGER' | 'ADMIN';
  }
