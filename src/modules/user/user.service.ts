import { Injectable, ConflictException, NotFoundException, HttpException, HttpStatus, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma';
import { CreateUserDto, UpdateUserDTO, GetListDTO, CreateRoleDTO } from './dto';
import { Prisma } from '@prisma/client';


// {
//   "email": "superadmin@example.com",
//   "password": "SuperPass123",
// }
@Injectable()
export class UserService {
  constructor(private _prisma: PrismaService) {}

  private async isSuperAdmin(userId: string): Promise<boolean> {
    const membership = await this._prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      include: { role: true },
    });
    return membership?.role?.name ? ['SuperAdmin', 'Admin', 'WorkerSystem'].includes(membership.role.name) : false;
  }

  private async isAdminOrSuper(userId: string): Promise<boolean> {
    const membership = await this._prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      include: { role: true },
    });
    return membership?.role?.name ? ['SuperAdmin', 'Admin'].includes(membership.role.name) : false;
  }

  async getUsersList(getUser: GetListDTO, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin, Admin или WorkerSystem может просматривать список пользователей');
      }

      const { page = 1, size = 10, deleted = false, name, clientId } = getUser;
      const whereClause: Prisma.UserWhereInput = deleted ? { deletedAt: { not: null } } : { deletedAt: null };

      if (name) {
        whereClause.fullName = { contains: name, mode: 'insensitive' };
      }

      if (clientId) {
        whereClause.memberships = {
          some: {
            companyId: clientId,
            deletedAt: null,
          },
        };
      }

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.user.findMany({
          skip: (page - 1) * size,
          take: size,
          where: whereClause,
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
        this._prisma.user.count({ where: whereClause }),
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
        throw new ForbiddenException('Только SuperAdmin, Admin или WorkerSystem может просматривать роли');
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
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin, Admin или WorkerSystem может просматривать список ролей');
      }

      const { page = 1, size = 10, deleted = false } = getRole;
      const whereClause: Prisma.RoleWhereInput = deleted ? { deletedAt: { not: null } } : { deletedAt: null };

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.role.findMany({
          skip: (page - 1) * size,
          take: size,
          where: whereClause,
          orderBy: { createdAt: 'desc' },
        }),
        this._prisma.role.count({ where: whereClause }),
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

      const { page = 1, size = 10, deleted = false } = getUserDocs;
      const whereClause: Prisma.DocumentWhereInput = {
        createdById: userId,
        ...(deleted ? { deletedAt: { not: null } } : { deletedAt: null }),
      };

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.document.findMany({
          where: whereClause,
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
        this._prisma.document.count({ where: whereClause }),
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

  async createRole(createRole: CreateRoleDTO, currentUserId: string) {
    try {
      const isAdmin = await this.isAdminOrSuper(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin или Admin может создавать роли');
      }

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
      // const isAdmin = await this.isAdminOrSuper(currentUserId);
      // if (!isAdmin) {
      //   throw new ForbiddenException('Только SuperAdmin или Admin может создавать пользователей');
      // }

      const existingUser = await this._prisma.user.findUnique({
        where: { email: createUserDto.email, deletedAt: null },
      });
      if (existingUser) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }

      if (createUserDto.companyId) {
        const company = await this._prisma.company.findUnique({
          where: { id: createUserDto.companyId, deletedAt: null },
        });
        if (!company) {
          throw new NotFoundException('Компания не найдена');
        }
      }

      if (!createUserDto.roleId) {
        throw new NotFoundException('Роль обязательна для создания пользователя');
      }

      const role = await this._prisma.role.findUnique({
        where: { id: createUserDto.roleId, deletedAt: null },
      });
      if (!role) {
        throw new NotFoundException('Роль не найдена');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

      const user = await this._prisma.user.create({
        data: {
          email: createUserDto.email,
          passwordHash: hashedPassword,
          fullName: createUserDto.fullName,
          createdById: currentUserId,
          memberships: {
            create: {
              companyId: createUserDto.companyId ?? null,
              roleId: createUserDto.roleId,
              createdById: currentUserId,
            },
          },
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
      const isAdmin = await this.isAdminOrSuper(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin или Admin может обновлять роли');
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
      const isAdmin = await this.isAdminOrSuper(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin или Admin может удалять пользователей');
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
      const isAdmin = await this.isAdminOrSuper(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin или Admin может удалять роли');
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

  async searchUsers(query: string, currentUserId: string) {
    try {
      const isAdmin = await this.isSuperAdmin(currentUserId);
      if (!isAdmin) {
        throw new ForbiddenException('Только SuperAdmin, Admin или WorkerSystem может искать пользователей');
      }

      const users = await this._prisma.user.findMany({
        where: {
          OR: [
            { email: { contains: query, mode: 'insensitive' } },
            { fullName: { contains: query, mode: 'insensitive' } },
          ],
          deletedAt: null,
        },
        include: {
          memberships: {
            where: { deletedAt: null },
            include: {
              role: { select: { id: true, name: true } },
            },
          },
        },
      });

      return users;
    } catch (error) {
      throw new HttpException(
        'Ошибка при поиске пользователей: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}