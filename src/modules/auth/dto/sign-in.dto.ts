import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDTO {
  @ApiProperty({ example: 'user@example.com', description: 'Электронная почта пользователя' })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({ example: 'password123', description: 'Пароль пользователя' })
  @IsNotEmpty()
  @IsString()
  password: string;
}