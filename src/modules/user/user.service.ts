import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDTO } from './dto/create-user.dto';
@Injectable()
export class UserService {
  constructor(private _prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto) {
    const existingUser = await this._prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this._prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: hashedPassword,
        fullName: createUserDto.fullName,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findOne(id: string) {
    const user = await this._prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO) {
    const user = await this._prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    if (updateUserDto.email) {
      const existingUser = await this._prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });
      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
    }

    const data: any = { ...updateUserDto };
    if (updateUserDto.password) {
      data.passwordHash = await bcrypt.hash(updateUserDto.password, 10);
      delete data.password;
    }

    const updatedUser = await this._prisma.user.update({
      where: { id },
      data,
      select: {
        id: true,
        email: true,
        fullName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedUser;
  }
}