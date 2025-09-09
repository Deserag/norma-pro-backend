import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SignInDTO } from './dto';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // мок-пользователь (пока нет базы)
  private mockUser = {
    id: 'mock-uuid-123',
    email: 'mock.user_2025@example-secure.org',
    fullName: 'Mock User',
    password: 'S3Q!Mr3_P@Ksw6rd!2Q.VsUq',
  };

  async signIn(
    signInDTO: SignInDTO,
  ): Promise<{
    accessToken: string;
    user: { id: string; email: string; fullName: string };
  }> {
    let user = await this.prisma.user.findUnique({
      where: { email: signInDTO.login },
    });

    // Если пользователь есть в БД
    if (user) {
      const isPasswordValid = await bcrypt.compare(
        signInDTO.password,
        user.passwordHash,
      );
      if (!isPasswordValid) {
        throw new UnauthorizedException('Неверные учетные данные');
      }
    } else {
      // Проверяем на мок-пользователя
      if (
        signInDTO.login !== this.mockUser.email ||
        signInDTO.password !== this.mockUser.password
      ) {
        throw new UnauthorizedException('Неверные учетные данные');
      }
      user = this.mockUser as any;
    }

    const payload = {
      sub: user!.id ,
      email: user!.email,
      fullName: user!.fullName,
    };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: { id: user!.id, email: user!.email, fullName: user!.fullName },
    };
  }
}
