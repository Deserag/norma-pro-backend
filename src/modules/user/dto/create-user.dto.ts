import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Электронная почта пользователя' })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Полное имя пользователя' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'company-uuid-1', description: 'ID компании' })
  @IsOptional()
  @IsString()
  companyId?: string;

  @ApiProperty({ example: '1', description: 'ID роли' })
  @IsOptional()
  @IsString()
  roleId: string;
}

export class UpdateUserDTO {
  @ApiProperty({ example: 'user@example.com', description: 'Электронная почта пользователя' })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Новый пароль пользователя' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Полное имя пользователя' })
  @IsOptional()
  @IsString()
  fullName?: string;
}