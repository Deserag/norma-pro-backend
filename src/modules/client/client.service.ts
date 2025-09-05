import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateClientDTO, CreateUserClientDTO, CreateOrderClientDTO, getClientDTO, addDocsClientDTO, UpdateClientDTO, UpdateUserClientDTO, UpdateOrderClientDTO, getUsersListClientDTO } from './dto';
import { getOrderDocsClientDTO } from './dto';
@Injectable()
export class ClientService {
  private _prisma = new PrismaClient();

  async getListClients(getClients: getClientDTO){

  }

  async getClient(id: string){

  }

  async getUsersListClient(getUsersListClient: getUsersListClientDTO){

  }

  async getClientDocs(id: string){

  }

  async getOrdersClient(id: string){

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