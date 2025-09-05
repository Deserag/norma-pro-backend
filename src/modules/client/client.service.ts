import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateClientDTO, CreateUserClientDTO, CreateOrderClientDTO, getClientDTO, addDocsClientDTO, UpdateClientDTO, UpdateUserClientDTO, UpdateOrderClientDTO, getUsersListClientDTO, getDocsClientDTO, getOrdersClientDTO } from './dto';
import { getOrderDocsClientDTO } from './dto';
@Injectable()
export class ClientService {
  private _prisma = new PrismaClient();

  async getListClients(getClients: getClientDTO){
    try {
      const { page = 1, size = 10 } = getClients;
      const [rows, totalCount] = await this._prisma.$transaction([
        this._prisma.company.findMany({
          skip: (page - 1) * size,
          take: size,
          orderBy: { createdAt: 'desc' },
          where: {
            // deletedAt: null,
          },
        }),
        this._prisma.company.count({
          where: {
            // deletedAt: null,
          },
        }),
      ]);
      return {
        rows,
        totalCount,
        totalPages: Math.ceil(totalCount / size),
        currentPage: page,
      };
    } catch (error) {
      throw new HttpException(
        'Ошибка при получении клиентов: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getClientbyId(id: string) {
    try {
      const client = await this._prisma.company.findUnique({
        where: { id },
        include: {
          memberships: {
            // where: { deletedAt: null },
            include: {
              user: {
                select: {
                  id: true,
                  email: true,
                  fullName: true,
                  createdAt: true,
                  updatedAt: true,
                  // deletedAt: true,
                },
              },
              role: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          orders: {
            where: { deletedAt: null },
            include: {
              status: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
          companyDocs: {
            where: { deletedAt: null },
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
        throw new HttpException('Клиент не найден', HttpStatus.NOT_FOUND);
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
          // deletedAt: membership.user.deletedAt,
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
        'Ошибка при получении клиента: ' + error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getUsersListClient(getUsersListClient: getUsersListClientDTO){

  }

  async getClientDocs(clientDocs: getDocsClientDTO){

  }

  async getOrdersClient(ordersClient: getOrdersClientDTO){

  }

  async getOrderDocsClient (getOrderDocsClient:getOrderDocsClientDTO){}

  async createClient(createClient: CreateClientDTO){

  }

  async createUserClient(createUserClient: CreateUserClientDTO){

  }

  async createOrderClient( createOrderClient: CreateOrderClientDTO){

  }

  async addDocsClient( addDocsClient: addDocsClientDTO){

  }

  async updateClient(updateClient: UpdateClientDTO){

  }

  async updateUserClient(updateUserClient: UpdateUserClientDTO){

  }

  async updateOrderClient (updateOrderClient: UpdateOrderClientDTO){

  }

  




}