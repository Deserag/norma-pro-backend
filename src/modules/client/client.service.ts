import {
  HttpException,
  HttpStatus,
  Injectable,
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import { UserService } from '../user/user.service';
import {
  CreateClientDTO,
  CreateUserClientDTO,
  CreateOrderClientDTO,
  getClientDTO,
  addDocsClientDTO,
  UpdateClientDTO,
  UpdateUserClientDTO,
  UpdateOrderClientDTO,
  getUsersListClientDTO,
  getDocsClientDTO,
  getOrdersClientDTO,
  getOrderDocsClientDTO,
  CreateProjectStatusDTO,
  UpdateProjectStatusDTO,
  CreateProjectDTO,
  UpdateProjectDTO,
} from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ClientService {
  constructor(
    private _prisma: PrismaService,
    // private _userService: UserService,
  ) {}

  private async isSuperAdminOrSystem(userId: string): Promise<boolean> {
    const membership = await this._prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      include: { role: true },
    });
    return membership?.role?.name
      ? ['SuperAdmin', 'Admin', 'WorkerSystem'].includes(membership.role.name)
      : false;
  }

  private async isAdminOrSuperOrAdminClient(userId: string): Promise<boolean> {
    const membership = await this._prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      include: { role: true },
    });
    return membership?.role?.name ? ['SuperAdmin', 'Admin', 'WorkerSystem'].includes(membership.role.name) : false;
  }

  private async hasCompanyAccess(
    userId: string,
  ): Promise<boolean> {
    const membership = await this._prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      include: { role: true },
    });
    return membership?.role?.name
      ? [
          'SuperAdmin',
          'Admin',
          'WorkerSystem',
          'AdminClient',
          'WorkerClient',
          'Auditor',
          'Support',
        ].includes(membership.role.name)
      : false;
  }

  async getListClients(getClients: getClientDTO, currentUserId: string) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      const hasViewAccess = await this._prisma.membership.findFirst({
        where: {
          userId: currentUserId,
          deletedAt: null,
          role: { name: { in: ['Auditor', 'Support'] } },
        },
      });
      if (!isSystem && !hasViewAccess) {
        throw new ForbiddenException(
          'Доступ к списку клиентов только для SuperAdmin, Admin, WorkerSystem, Auditor или Support',
        );
      }

      const { page = 1, size = 10, name, deletedAt = false } = getClients;
      const whereClause: Prisma.CompanyWhereInput = deletedAt
        ? { deletedAt: { not: null } }
        : { deletedAt: null };
      if (name) {
        whereClause.name = { contains: name, mode: 'insensitive' };
      }

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.company.findMany({
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
          where: whereClause,
        }),
        this._prisma.company.count({ where: whereClause }),
      ]);

      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении клиентов: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getClientbyId(getClients: getClientDTO) {
    try {
      const hasAccess = await this.hasCompanyAccess(getClients.clientId);
      const isSystem = await this.isSuperAdminOrSystem(getClients.clientId);
      if (!hasAccess && !isSystem) {
        throw new ForbiddenException(
          'Доступ к данным клиента только для связанных пользователей или системных ролей',
        );
      }

      const client = await this._prisma.company.findUnique({
        where: { id: getClients.clientId, deletedAt: getClients.deletedAt ? { not: null } : null },
        include: {
          memberships: {
            where: { deletedAt: getClients.deletedAt ? { not: null } : null },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  createdAt: true,
                  updatedAt: true,
                  deletedAt: true,
                },
              },
              role: {
                select: { id: true, name: true },
              },
            },
          },
          orders: {
            where: { deletedAt: getClients.deletedAt ? { not: null } : null },
            include: {
              status: {
                select: { id: true, name: true },
              },
            },
          },
          companyDocs: {
            where: { deletedAt: getClients.deletedAt ? { not: null } : null },
            include: {
              document: {
                select: {
                  id: true,
                  code: true,
                  title: true,
                  description: true,
                  createdAt: true,
                  updatedAt: true,
                  deletedAt: true,
                },
              },
              pinnedVersion: {
                select: {
                  id: true,
                  versionLabel: true,
                  fileUrl: true,
                  effectiveDate: true,
                  publishedDate: true,
                  isCurrent: true,
                  createdAt: true,
                  updatedAt: true,
                  deletedAt: true,
                },
              },
            },
          },
        },
      });

      if (!client) {
        throw new NotFoundException('Клиент не найден');
      }

      return {
        id: client.id,
        name: client.name,
        inn: client.inn,
        createdAt: client.createdAt,
        updatedAt: client.updatedAt,
        deletedAt: client.deletedAt,
        createdById: client.createdById,
        users: client.memberships.map((membership) => ({
          id: membership.user.id,
          email: membership.user.email,
          fullName: membership.user.fullName,
          createdAt: membership.user.createdAt,
          updatedAt: membership.user.updatedAt,
          deletedAt: membership.user.deletedAt,
          role: {
            id: membership.role.id,
            name: membership.role.name,
          },
        })),
        orders: client.orders.map((order) => ({
          id: order.id,
          amount: order.amount,
          status: {
            id: order.status.id,
            name: order.status.name,
          },
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          deletedAt: order.deletedAt,
          createdById: order.createdById,
        })),
        documents: client.companyDocs.map((doc) => ({
          id: doc.id,
          document: {
            id: doc.document.id,
            code: doc.document.code,
            title: doc.document.title,
            description: doc.document.description,
            createdAt: doc.document.createdAt,
            updatedAt: doc.document.updatedAt,
            deletedAt: doc.document.deletedAt,
          },
          pinnedVersion: doc.pinnedVersion
            ? {
                id: doc.pinnedVersion.id,
                versionLabel: doc.pinnedVersion.versionLabel,
                fileUrl: doc.pinnedVersion.fileUrl,
                effectiveDate: doc.pinnedVersion.effectiveDate,
                publishedDate: doc.pinnedVersion.publishedDate,
                isCurrent: doc.pinnedVersion.isCurrent,
                createdAt: doc.pinnedVersion.createdAt,
                updatedAt: doc.pinnedVersion.updatedAt,
                deletedAt: doc.pinnedVersion.deletedAt,
              }
            : null,
          notes: doc.notes,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          deletedAt: doc.deletedAt,
          createdById: doc.createdById,
        })),
      };
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении клиента: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsersListClient(
    getUsersListClient: getUsersListClientDTO,
    currentUserId: string,
  ) {
    try {
      const { companyId, page = 1, size = 10, name, deletedAt = false } = getUsersListClient;
      const hasAccess = await this.hasCompanyAccess(currentUserId);
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!hasAccess && !isSystem) {
        throw new ForbiddenException(
          'Доступ к списку пользователей клиента только для связанных пользователей или системных ролей',
        );
      }

      const whereClause: Prisma.MembershipWhereInput = {
        companyId,
        deletedAt:  deletedAt ? { not: null } : null,
      };
      if (name) {
        whereClause.user = {
          fullName: { contains: name, mode: 'insensitive' },
        };
      }

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.membership.findMany({
          where: whereClause,
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
          include: {
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
              },
            },
            role: {
              select: { id: true, name: true },
            },
          },
        }),
        this._prisma.membership.count({ where: whereClause }),
      ]);

      return {
        rows: rows.map((m) => ({
          id: m.user.id,
          email: m.user.email,
          fullName: m.user.fullName,
          createdAt: m.user.createdAt,
          updatedAt: m.user.updatedAt,
          deletedAt: m.user.deletedAt,
          role: { id: m.role.id, name: m.role.name },
        })),
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении пользователей клиента: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getClientDocs(
    clientDocs: getDocsClientDTO,
    currentUserId: string,
  ) {
    try {
      const { companyId, page = 1, size = 10, title, deletedAt = false } = clientDocs;
      const hasAccess = await this.hasCompanyAccess(currentUserId);
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!hasAccess && !isSystem) {
        throw new ForbiddenException(
          'Доступ к документам клиента только для связанных пользователей или системных ролей',
        );
      }

      const whereClause: Prisma.CompanyDocumentWhereInput = {
        companyId,
        deletedAt: deletedAt ? { not: null } : null,
      };
      if (title) {
        whereClause.document = {
          title: { contains: title, mode: 'insensitive' },
        };
      }

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.companyDocument.findMany({
          where: whereClause,
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
          include: {
            document: {
              select: {
                id: true,
                code: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
              },
            },
            pinnedVersion: {
              select: {
                id: true,
                versionLabel: true,
                fileUrl: true,
                effectiveDate: true,
                publishedDate: true,
                isCurrent: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
              },
            },
          },
        }),
        this._prisma.companyDocument.count({ where: whereClause }),
      ]);

      return {
        rows: rows.map((doc) => ({
          id: doc.id,
          document: {
            id: doc.document.id,
            code: doc.document.code,
            title: doc.document.title,
            description: doc.document.description,
            createdAt: doc.document.createdAt,
            updatedAt: doc.document.updatedAt,
            deletedAt: doc.document.deletedAt,
          },
          pinnedVersion: doc.pinnedVersion
            ? {
                id: doc.pinnedVersion.id,
                versionLabel: doc.pinnedVersion.versionLabel,
                fileUrl: doc.pinnedVersion.fileUrl,
                effectiveDate: doc.pinnedVersion.effectiveDate,
                publishedDate: doc.pinnedVersion.publishedDate,
                isCurrent: doc.pinnedVersion.isCurrent,
                createdAt: doc.pinnedVersion.createdAt,
                updatedAt: doc.pinnedVersion.updatedAt,
                deletedAt: doc.pinnedVersion.deletedAt,
              }
            : null,
          notes: doc.notes,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
          deletedAt: doc.deletedAt,
          createdById: doc.createdById,
        })),
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении документов клиента: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrdersClient(
    ordersClient: getOrdersClientDTO,
    currentUserId: string,
  ) {
    try {
      const { companyId, page = 1, size = 10, deletedAt = false } = ordersClient;
      const hasAccess = await this.hasCompanyAccess(currentUserId);
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!hasAccess && !isSystem) {
        throw new ForbiddenException(
          'Доступ к заказам клиента только для связанных пользователей или системных ролей',
        );
      }

      const whereClause: Prisma.OrderWhereInput = {
        companyId,
        deletedAt: deletedAt ? { not: null } : null,
      };

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.order.findMany({
          where: whereClause,
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
          include: {
            status: {
              select: { id: true, name: true },
            },
          },
        }),
        this._prisma.order.count({ where: whereClause }),
      ]);

      return {
        rows: rows.map((order) => ({
          id: order.id,
          amount: order.amount,
          status: {
            id: order.status.id,
            name: order.status.name,
          },
          createdAt: order.createdAt,
          updatedAt: order.updatedAt,
          deletedAt: order.deletedAt,
          createdById: order.createdById,
        })),
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении заказов клиента: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getOrderDocsClient(
    getOrderDocsClient: getOrderDocsClientDTO,
    currentUserId: string,
  ) {
    try {
      const { orderId, page = 1, size = 10, deletedAt = false } = getOrderDocsClient;
      const order = await this._prisma.order.findUnique({
        where: { id: orderId, deletedAt: deletedAt ? { not: null } : null },
        select: { companyId: true },
      });
      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }

      const hasAccess = await this.hasCompanyAccess(currentUserId);
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!hasAccess && !isSystem) {
        throw new ForbiddenException(
          'Доступ к документам заказа только для связанных пользователей или системных ролей',
        );
      }

      const whereClause: Prisma.PackageItemWhereInput = {
        package: { orderId, deletedAt: deletedAt ? { not: null } : null },
        deletedAt: deletedAt ? { not: null } : null,
      };

      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.packageItem.findMany({
          where: whereClause,
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
          include: {
            document: {
              select: {
                id: true,
                code: true,
                title: true,
                description: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
              },
            },
            version: {
              select: {
                id: true,
                versionLabel: true,
                fileUrl: true,
                effectiveDate: true,
                publishedDate: true,
                isCurrent: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
              },
            },
          },
        }),
        this._prisma.packageItem.count({ where: whereClause }),
      ]);

      return {
        rows: rows.map((item) => ({
          id: item.id,
          document: {
            id: item.document.id,
            code: item.document.code,
            title: item.document.title,
            description: item.document.description,
            createdAt: item.document.createdAt,
            updatedAt: item.document.updatedAt,
            deletedAt: item.document.deletedAt,
          },
          version: {
            id: item.version.id,
            versionLabel: item.version.versionLabel,
            fileUrl: item.version.fileUrl,
            effectiveDate: item.version.effectiveDate,
            publishedDate: item.version.publishedDate,
            isCurrent: item.version.isCurrent,
            createdAt: item.version.createdAt,
            updatedAt: item.version.updatedAt,
            deletedAt: item.version.deletedAt,
          },
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          deletedAt: item.deletedAt,
          createdById: item.createdById,
        })),
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        `Ошибка при получении документов заказа: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createClient(createClient: CreateClientDTO, currentUserId: string) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Создание клиента доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const { name, inn } = createClient;
      const existingClient = await this._prisma.company.findFirst({
        where: { OR: [{ name }, { inn }], deletedAt: null },
      });
      if (existingClient) {
        throw new ConflictException(
          `Компания с названием "${name}" или ИНН "${inn}" уже существует`,
        );
      }

      return await this._prisma.company.create({
        data: {
          name,
          inn,
          createdById: currentUserId,
        },
        select: {
          id: true,
          name: true,
          inn: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при создании клиента: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createUserClient(
    createUserClient: CreateUserClientDTO,
    currentUserId: string,
  ) {
    try {
      const { companyId, userId, roleId, email, fullName, password } =
        createUserClient;
      const isAllowed = await this.isAdminOrSuperOrAdminClient(
        currentUserId,
      );
      if (!isAllowed) {
        throw new ForbiddenException(
          'Добавление пользователя в компанию доступно только для SuperAdmin, Admin, WorkerSystem или AdminClient',
        );
      }

      const company = await this._prisma.company.findUnique({
        where: { id: companyId, deletedAt: null },
      });
      if (!company) {
        throw new NotFoundException('Компания не найдена');
      }

      const role = await this._prisma.role.findUnique({
        where: { id: roleId, deletedAt: null },
      });
      if (!role) {
        throw new NotFoundException('Роль не найдена');
      }

      let targetUserId = userId;
      if (!userId && email && fullName && password) {
        // const newUser = await this._userService.createUser(
        //   {
        //     email,
        //     fullName,
        //     password,
        //     roleId,
        //     companyId,
        //   },
        //   currentUserId,
        // );
        // targetUserId = newUser.id;
      } else if (userId) {
        const existingUser = await this._prisma.user.findUnique({
          where: { id: userId, deletedAt: null },
        });
        if (!existingUser) {
          throw new NotFoundException('Пользователь не найден');
        }
        const existingMembership = await this._prisma.membership.findUnique({
          where: {
            userId_companyId: { userId, companyId },
            deletedAt: null,
          },
        });
        if (existingMembership) {
          throw new ConflictException(
            'Пользователь уже привязан к этой компании',
          );
        }
      } else {
        throw new HttpException(
          'Необходимо указать userId или email, fullName и password',
          HttpStatus.BAD_REQUEST,
        );
      }

      const membership = await this._prisma.membership.create({
        data: {
          userId: targetUserId,
          companyId,
          roleId,
          createdById: currentUserId,
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
          },
          role: {
            select: { id: true, name: true },
          },
        },
      });

      return {
        id: membership.id,
        user: {
          id: membership.user.id,
          email: membership.user.email,
          fullName: membership.user.fullName,
          createdAt: membership.user.createdAt,
          updatedAt: membership.user.updatedAt,
          deletedAt: membership.user.deletedAt,
        },
        role: {
          id: membership.role.id,
          name: membership.role.name,
        },
        companyId: membership.companyId,
        createdAt: membership.createdAt,
        updatedAt: membership.updatedAt,
        deletedAt: membership.deletedAt,
      };
    } catch (error) {
      throw new HttpException(
        `Ошибка при добавлении пользователя в компанию: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createOrderClient(
    createOrderClient: CreateOrderClientDTO,
    currentUserId: string,
  ) {
    try {
      const { companyId, amount, statusId } = createOrderClient;
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Создание заказа доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const company = await this._prisma.company.findUnique({
        where: { id: companyId, deletedAt: null },
      });
      if (!company) {
        throw new NotFoundException('Компания не найдена');
      }

      const status = await this._prisma.orderStatus.findUnique({
        where: { id: statusId, deletedAt: null },
      });
      if (!status) {
        throw new NotFoundException('Статус заказа не найден');
      }

      return await this._prisma.order.create({
        data: {
          companyId,
          amount,
          statusId,
          createdById: currentUserId,
        },
        include: {
          status: { select: { id: true, name: true } },
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при создании заказа: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addDocsClient(
    addDocsClient: addDocsClientDTO,
    currentUserId: string,
  ) {
    try {
      const { companyId, documentId, pinnedVersionId, notes } = addDocsClient;
      const isAllowed = await this.isAdminOrSuperOrAdminClient(
        currentUserId,
      );
      if (!isAllowed) {
        throw new ForbiddenException(
          'Добавление документа в компанию доступно только для SuperAdmin, Admin, WorkerSystem или AdminClient',
        );
      }

      const company = await this._prisma.company.findUnique({
        where: { id: companyId, deletedAt: null },
      });
      if (!company) {
        throw new NotFoundException('Компания не найдена');
      }

      const document = await this._prisma.document.findUnique({
        where: { id: documentId, deletedAt: null },
      });
      if (!document) {
        throw new NotFoundException('Документ не найден');
      }

      if (pinnedVersionId) {
        const version = await this._prisma.documentVersion.findUnique({
          where: { id: pinnedVersionId, documentId, deletedAt: null },
        });
        if (!version) {
          throw new NotFoundException('Версия документа не найдена');
        }
      }

      const existingDoc = await this._prisma.companyDocument.findFirst({
        where: { companyId, documentId, deletedAt: null },
      });
      if (existingDoc) {
        throw new ConflictException(
          'Документ уже привязан к этой компании',
        );
      }

      return await this._prisma.companyDocument.create({
        data: {
          companyId,
          documentId,
          pinnedVersionId,
          notes,
          createdById: currentUserId,
        },
        include: {
          document: {
            select: {
              id: true,
              code: true,
              title: true,
              description: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
          },
          pinnedVersion: {
            select: {
              id: true,
              versionLabel: true,
              fileUrl: true,
              effectiveDate: true,
              publishedDate: true,
              isCurrent: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при добавлении документа в компанию: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateClient(
    id: string,
    updateClient: UpdateClientDTO,
    currentUserId: string,
  ) {
    try {
      const isAllowed = await this.isAdminOrSuperOrAdminClient(currentUserId);
      if (!isAllowed) {
        throw new ForbiddenException(
          'Обновление клиента доступно только для SuperAdmin, Admin, WorkerSystem или AdminClient',
        );
      }

      const client = await this._prisma.company.findUnique({
        where: { id, deletedAt: null },
      });
      if (!client) {
        throw new NotFoundException('Клиент не найден');
      }

      if (updateClient.name || updateClient.inn) {
        const existingClient = await this._prisma.company.findFirst({
          where: {
            OR: [
              updateClient.name ? { name: updateClient.name } : {},
              updateClient.inn ? { inn: updateClient.inn } : {},
            ],
            id: { not: id },
            deletedAt: null,
          },
        });
        if (existingClient) {
          throw new ConflictException(
            `Компания с названием "${updateClient.name}" или ИНН "${updateClient.inn}" уже существует`,
          );
        }
      }

      return await this._prisma.company.update({
        where: { id },
        data: {
          ...updateClient,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          inn: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при обновлении клиента: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateUserClient(
    updateUserClient: UpdateUserClientDTO,
    currentUserId: string,
  ) {
    try {
      const { userId, companyId, roleId } = updateUserClient;
      const isAllowed = await this.isAdminOrSuperOrAdminClient(
        currentUserId,
      );
      if (!isAllowed) {
        throw new ForbiddenException(
          'Обновление пользователя компании доступно только для SuperAdmin, Admin, WorkerSystem или AdminClient',
        );
      }

      const membership = await this._prisma.membership.findUnique({
        where: {
          userId_companyId: { userId, companyId },
          deletedAt: null,
        },
      });
      if (!membership) {
        throw new NotFoundException(
          'Пользователь не привязан к этой компании',
        );
      }

      const role = await this._prisma.role.findUnique({
        where: { id: roleId, deletedAt: null },
      });
      if (!role) {
        throw new NotFoundException('Роль не найдена');
      }

      return await this._prisma.membership.update({
        where: {
          userId_companyId: { userId, companyId },
        },
        data: {
          roleId,
          updatedAt: new Date(),
        },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
          },
          role: {
            select: { id: true, name: true },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при обновлении пользователя компании: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateOrderClient(
    id: string,
    updateOrderClient: UpdateOrderClientDTO,
    currentUserId: string,
  ) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Обновление заказа доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const order = await this._prisma.order.findUnique({
        where: { id, deletedAt: null },
      });
      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }

      if (updateOrderClient.statusId) {
        const status = await this._prisma.orderStatus.findUnique({
          where: { id: updateOrderClient.statusId, deletedAt: null },
        });
        if (!status) {
          throw new NotFoundException('Статус заказа не найден');
        }
      }

      return await this._prisma.order.update({
        where: { id },
        data: {
          ...updateOrderClient,
          updatedAt: new Date(),
        },
        include: {
          status: { select: { id: true, name: true } },
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при обновлении заказа: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteClient(id: string, currentUserId: string) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Удаление клиента доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const client = await this._prisma.company.findUnique({
        where: { id, deletedAt: null },
      });
      if (!client) {
        throw new NotFoundException('Клиент не найден');
      }

      return await this._prisma.company.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: {
          id: true,
          name: true,
          inn: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при удалении клиента: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteUserClient(
    userId: string,
    companyId: string,
    currentUserId: string,
  ) {
    try {
      const isAllowed = await this.isAdminOrSuperOrAdminClient(
        currentUserId,
      );
      if (!isAllowed) {
        throw new ForbiddenException(
          'Удаление пользователя из компании доступно только для SuperAdmin, Admin, WorkerSystem или AdminClient',
        );
      }

      const membership = await this._prisma.membership.findUnique({
        where: {
          userId_companyId: { userId, companyId },
          deletedAt: null,
        },
      });
      if (!membership) {
        throw new NotFoundException(
          'Пользователь не привязан к этой компании',
        );
      }

      return await this._prisma.membership.update({
        where: {
          userId_companyId: { userId, companyId },
        },
        data: { deletedAt: new Date() },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
              createdAt: true,
              updatedAt: true,
              deletedAt: true,
            },
          },
          role: {
            select: { id: true, name: true },
          },
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при удалении пользователя из компании: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteOrderClient(id: string, currentUserId: string) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Удаление заказа доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const order = await this._prisma.order.findUnique({
        where: { id, deletedAt: null },
      });
      if (!order) {
        throw new NotFoundException('Заказ не найден');
      }

      return await this._prisma.order.update({
        where: { id },
        data: { deletedAt: new Date() },
        include: {
          status: { select: { id: true, name: true } },
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при удалении заказа: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createProjectStatus(
    createProjectStatus: CreateProjectStatusDTO,
    currentUserId: string,
  ) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Создание статуса проекта доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const { name } = createProjectStatus;
      const existingStatus = await this._prisma.orderStatus.findUnique({
        where: { name, deletedAt: null },
      });
      if (existingStatus) {
        throw new ConflictException('Статус проекта с таким именем уже существует');
      }

      return await this._prisma.orderStatus.create({
        data: {
          name,
          createdById: currentUserId,
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при создании статуса проекта: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProjectStatus(
    id: string,
    updateProjectStatus: UpdateProjectStatusDTO,
    currentUserId: string,
  ) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Обновление статуса проекта доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const status = await this._prisma.orderStatus.findUnique({
        where: { id, deletedAt: null },
      });
      if (!status) {
        throw new NotFoundException('Статус проекта не найден');
      }

      if (updateProjectStatus.name) {
        const existingStatus = await this._prisma.orderStatus.findUnique({
          where: { name: updateProjectStatus.name, deletedAt: null },
        });
        if (existingStatus && existingStatus.id !== id) {
          throw new ConflictException('Статус проекта с таким именем уже существует');
        }
      }

      return await this._prisma.orderStatus.update({
        where: { id },
        data: {
          ...updateProjectStatus,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при обновлении статуса проекта: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteProjectStatus(id: string, currentUserId: string) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Удаление статуса проекта доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const status = await this._prisma.orderStatus.findUnique({
        where: { id, deletedAt: null },
      });
      if (!status) {
        throw new NotFoundException('Статус проекта не найден');
      }

      return await this._prisma.orderStatus.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при удалении статуса проекта: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async createProject(
    createProject: CreateProjectDTO,
    currentUserId: string,
  ) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Создание проекта доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const { companyId, name, description, statusId } = createProject;
      const company = await this._prisma.company.findUnique({
        where: { id: companyId, deletedAt: null },
      });
      if (!company) {
        throw new NotFoundException('Компания не найдена');
      }

      if (statusId) {
        const status = await this._prisma.orderStatus.findUnique({
          where: { id: statusId, deletedAt: null },
        });
        if (!status) {
          throw new NotFoundException('Статус проекта не найден');
        }
      }

      return await this._prisma.project.create({
        data: {
          companyId,
          name,
          description,
          // statusId,
          createdBy: currentUserId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          createdBy: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при создании проекта: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async updateProject(
    id: string,
    updateProject: UpdateProjectDTO,
    currentUserId: string,
  ) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Обновление проекта доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const project = await this._prisma.project.findUnique({
        where: { id, deletedAt: null },
      });
      if (!project) {
        throw new NotFoundException('Проект не найден');
      }

      if (updateProject.statusId) {
        const status = await this._prisma.orderStatus.findUnique({
          where: { id: updateProject.statusId, deletedAt: null },
        });
        if (!status) {
          throw new NotFoundException('Статус проекта не найден');
        }
      }

      return await this._prisma.project.update({
        where: { id },
        data: {
          ...updateProject,
          updatedAt: new Date(),
        },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          createdBy: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при обновлении проекта: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteProject(id: string, currentUserId: string) {
    try {
      const isSystem = await this.isSuperAdminOrSystem(currentUserId);
      if (!isSystem) {
        throw new ForbiddenException(
          'Удаление проекта доступно только для SuperAdmin, Admin или WorkerSystem',
        );
      }

      const project = await this._prisma.project.findUnique({
        where: { id, deletedAt: null },
      });
      if (!project) {
        throw new NotFoundException('Проект не найден');
      }

      return await this._prisma.project.update({
        where: { id },
        data: { deletedAt: new Date() },
        select: {
          id: true,
          name: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          createdBy: true,
        },
      });
    } catch (error) {
      throw new HttpException(
        `Ошибка при удалении проекта: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}