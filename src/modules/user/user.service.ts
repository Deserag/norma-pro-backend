import { Injectable, ConflictException, NotFoundException, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma';
import { CreateUserDto, UpdateUserDTO, GetListDTO, CreateRoleDTO } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private _prisma: PrismaService) {}

  private async isSuperAdmin(userId: string): Promise<boolean> {
    const membership = await this._prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      include: { role: true },
    });
    return membership?.role.name === 'SuperAdmin';
  }

  async getUsersList(getUser: GetListDTO, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin может просматривать список пользователей');
      }

      const { page = 1, size = 10 } = getUser;
      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.user.findMany({
          skip: (page - 1) * size,
          take: size,
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
          include: {
            memberships: {
              where: { deletedAt: null },
              include: {
                role: { select: { id: true, name: true } },
              },
            },
          },
        }),
        this._prisma.user.count({ where: { deletedAt: null } }),
      ]);
      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении пользователей: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserById(id: string, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin && id !== currentUserId) {
        throw new ForbiddenException('Доступ запрещен');
      }

      const user = await this._prisma.user.findUnique({
        where: { id, deletedAt: null },
        include: {
          memberships: {
            where: { deletedAt: null },
            include: {
              role: { select: { id: true, name: true } },
            },
          },
          createdDocuments: {
            where: { deletedAt: null },
            select: {
              id: true,
              code: true,
              title: true,
              description: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
              currentVersion: {
                select: {
                  id: true,
                  versionLabel: true,
                  fileUrl: true,
                  isCurrent: true,
                  createdAt: true,
                  updatedAt: true,
                  deletedAt: true,
                },
              },
              type: { select: { id: true, name: true } },
              status: { select: { id: true, name: true } },
            },
          },
        },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении пользователя: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getRoleById(id: string, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin может просматривать роли');
      }

      const role = await this._prisma.role.findUnique({
        where: { id, deletedAt: null },
      });
      if (!role) {
        throw new NotFoundException('Роль не найдена');
      }
      return role;
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении роли: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getRolesList(getRole: GetListDTO, currentUserId: string) {
    try {
      // const isAdmin = await this.isSuperAdmin(currentUserId);
      // if (!isAdmin) {
      //   throw new ForbiddenException('Только SuperAdmin может просматривать список ролей');
      // }

      const { page = 1, size = 10 } = getRole;
      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.role.findMany({
          skip: (page - 1) * size,
          take: size,
          where: { deletedAt: null },
          orderBy: { createdAt: 'desc' },
        }),
        this._prisma.role.count({ where: { deletedAt: null } }),
      ]);
      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении ролей: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUserDocsList(getUserDocs: GetListDTO, userId: string, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin && userId !== currentUserId) {
        throw new ForbiddenException('Доступ запрещен');
      }

      const { page = 1, size = 10 } = getUserDocs;
      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.document.findMany({
          where: { createdById: userId, deletedAt: null },
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
          include: {
            currentVersion: {
              select: {
                id: true,
                versionLabel: true,
                fileUrl: true,
                isCurrent: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
              },
            },
            type: { select: { id: true, name: true } },
            status: { select: { id: true, name: true } },
          },
        }),
        this._prisma.document.count({ where: { createdById: userId, deletedAt: null } }),
      ]);
      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении документов: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createRole(createRole: CreateRoleDTO) {
    try {
      // const isAdmin = await this.isSuperAdmin(currentUserId);
      // if (!isAdmin) {
      //   throw new ForbiddenException('Только SuperAdmin может создавать роли');
      // }

      const existingRole = await this._prisma.role.findUnique({
        where: { name: createRole.name, deletedAt: null },
      });
      if (existingRole) {
        throw new ConflictException('Роль с таким именем уже существует');
      }

      return await this._prisma.role.create({
        data: {
          name: createRole.name,
          description: createRole.description,
          // createdById: currentUserId,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании роли: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUser(createUserDto: CreateUserDto, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin может создавать пользователей');
      }

      const existingUser = await this._prisma.user.findUnique({
        where: { email: createUserDto.email, deletedAt: null },
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
          createdById: currentUserId,
          ...(createUserDto.companyId && createUserDto.roleId
            ? {
                memberships: {
                  create: {
                    companyId: createUserDto.companyId,
                    roleId: createUserDto.roleId,
                    createdById: currentUserId,
                  },
                },
              }
            : {}),
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
    } catch (error) {
      throw new HttpException(
        'Ошибка при создании пользователя: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUser(id: string, updateUserDto: UpdateUserDTO, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin && id !== currentUserId) {
        throw new ForbiddenException('Доступ запрещен');
      }

      const user = await this._prisma.user.findUnique({
        where: { id, deletedAt: null },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      if (updateUserDto.email) {
        const existingUser = await this._prisma.user.findUnique({
          where: { email: updateUserDto.email, deletedAt: null },
        });
        if (existingUser && existingUser.id !== id) {
          throw new ConflictException('Пользователь с таким email уже существует');
        }
      }

      const data: any = { ...updateUserDto, updatedAt: new Date() };
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
    } catch (error) {
      throw new HttpException(
        'Ошибка при обновлении пользователя: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateRole(id: string, updateRoleDto: CreateRoleDTO, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin может обновлять роли');
      }

      const role = await this._prisma.role.findUnique({
        where: { id, deletedAt: null },
      });
      if (!role) {
        throw new NotFoundException('Роль не найдена');
      }

      if (updateRoleDto.name) {
        const existingRole = await this._prisma.role.findUnique({
          where: { name: updateRoleDto.name, deletedAt: null },
        });
        if (existingRole && existingRole.id !== id) {
          throw new ConflictException('Роль с таким именем уже существует');
        }
      }

      return await this._prisma.role.update({
        where: { id },
        data: { name: updateRoleDto.name, updatedAt: new Date() },
      });
    } catch (error) {
      throw new HttpException(
        'Ошибка при обновлении роли: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUser(id: string, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin может удалять пользователей');
      }

      const user = await this._prisma.user.findUnique({
        where: { id, deletedAt: null },
      });
      if (!user) {
        throw new NotFoundException('Пользователь не найден');
      }

      return await this._prisma.user.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: {
          id: true,
          email: true,
          fullName: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении пользователя: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteRole(id: string, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin может удалять роли');
      }

      const role = await this._prisma.role.findUnique({
        where: { id, deletedAt: null },
      });
      if (!role) {
        throw new NotFoundException('Роль не найдена');
      }

      return await this._prisma.role.update({
        where: { id },
        data: { deletedAt: new Date() },
      });
    } catch (error) {
      throw new HttpException(
        'Ошибка при удалении роли: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}