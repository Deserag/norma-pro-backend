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

  async signIn(signInDTO: SignInDTO): Promise<{ accessToken: string; user: { id: string; email: string; fullName: string } }> {
    const user = await this.prisma.user.findUnique({
      where: { email: signInDTO.login },
    });

    if (!user) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const isPasswordValid = await bcrypt.compare(signInDTO.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Неверные учетные данные');
    }

    const payload = { sub: user.id, email: user.email, fullName: user.fullName };
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.fullName },
    };
  }
}