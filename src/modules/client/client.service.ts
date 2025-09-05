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

  async getClientbyId(id: string){
    try {
      const findClient = await this._prisma.company.findUnique({
        where: { id: id}
      })

      const findUsersCompany = await this._prisma.membership.findMany({
        where: { companyId: findClient?.id}
      })

      const findOrdersCompany = await this._prisma.order.findMany({
        where: {companyId: findClient?.id}
      })

      // const findDOcsCompany = await this._prisma.findMany({
      //   where: {c}
      // })
    }
    catch (error){
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