import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

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

  @ApiProperty({ example: 'Иван Иванов', description: 'Полное имя пользователя' })
  @IsNotEmpty()
  @IsString()
  companyId: string;

  @ApiProperty({ example: 'Иван Иванов', description: 'Полное имя пользователя' })
  @IsNotEmpty()
  @IsString()
  roleId: string;

}

export class UpdateUserDTO extends CreateUserDto {
  @ApiProperty({ example: 'user@example.com', description: 'Электронная почта пользователя' })
  @IsNotEmpty()
  @IsEmail()
  userId: string;
  
}