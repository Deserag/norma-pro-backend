import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';
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
} from './dto';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly _clientService: ClientService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получение информации о клиенте по ID' })
  @ApiResponse({ status: 200, description: 'Клиент успешно получен' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  async getClientById(@Body() getClients: getClientDTO) {
    return await this._clientService.getClientbyId(getClients);
  }

  @Post('list')
  @ApiOperation({ summary: 'Получение списка клиентов' })
  @ApiResponse({ status: 200, description: 'Клиенты успешно получены' })
  @ApiResponse({ status: 404, description: 'Клиенты не найдены' })
  @ApiBody({ type: getClientDTO })
  async getListClients(
    @Param('id') id: string,
    @Body() getListClientsDTO: getClientDTO,
  ) {
    return await this._clientService.getListClients(getListClientsDTO, id);
  }

  @Post('users/:id')
  @ApiOperation({ summary: 'Получение списка пользователей клиента' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей успешно получен',
  })
  @ApiResponse({
    status: 404,
    description: 'Клиент или пользователи не найдены',
  })
  @ApiBody({ type: getUsersListClientDTO })
  async getUsersListClient(
    @Param('id') id: string,
    @Body() getUsersListClient: getUsersListClientDTO,
  ) {
    return await this._clientService.getUsersListClient(getUsersListClient, id);
  }

  @Post('docs/:id')
  @ApiOperation({ summary: 'Получение документов клиента' })
  @ApiResponse({ status: 200, description: 'Документы успешно получены' })
  @ApiResponse({ status: 404, description: 'Клиент или документы не найдены' })
  @ApiBody({ type: getDocsClientDTO })
  async getDocsClient(
    @Param('id') id: string,
    @Body() clientsDocs: getDocsClientDTO,
  ) {
    return await this._clientService.getClientDocs(clientsDocs, id);
  }

  @Post('orders/:id')
  @ApiOperation({ summary: 'Получение заказов клиента' })
  @ApiResponse({ status: 200, description: 'Заказы успешно получены' })
  @ApiResponse({ status: 404, description: 'Клиент или заказы не найдены' })
  @ApiBody({ type: getOrdersClientDTO })
  async getOrdersClient(
    @Param('id') id: string,
    @Body() clientOrders: getOrdersClientDTO,
  ) {
    return await this._clientService.getOrdersClient(clientOrders, id);
  }

  @Post('orders/docs/:orderId')
  @ApiOperation({ summary: 'Получение документов заказа клиента' })
  @ApiResponse({
    status: 200,
    description: 'Документы заказа успешно получены',
  })
  @ApiResponse({ status: 404, description: 'Заказ или документы не найдены' })
  @ApiBody({ type: getOrderDocsClientDTO })
  async getOrderDocsClient(
    @Param('orderId') orderId: string,
    @Body() getOrderDocsClient: getOrderDocsClientDTO,
  ) {
    return await this._clientService.getOrderDocsClient(
      getOrderDocsClient,
      orderId,
    );
  }

  @Post()
  @ApiOperation({ summary: 'Создание нового клиента' })
  @ApiResponse({ status: 201, description: 'Клиент успешно создан' })
  @ApiResponse({
    status: 409,
    description: 'Клиент с таким именем или ИНН уже существует',
  })
  @ApiBody({ type: CreateClientDTO })
  async createClient(
    @Param('currentUserId') currentUserId: string,
    @Body() createClient: CreateClientDTO,
  ) {
    return await this._clientService.createClient(createClient, currentUserId);
  }

  @Post('users/:id')
  @ApiOperation({ summary: 'Создание пользователя для клиента' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  @ApiBody({ type: CreateUserClientDTO })
  async createUserClient(
    @Param('id') clientId: string,
    @Body() createUserClient: CreateUserClientDTO,
  ) {
    return await this._clientService.createUserClient(
      createUserClient,
      clientId,
    );
  }

  @Post('orders/:id')
  @ApiOperation({ summary: 'Создание заказа для клиента' })
  @ApiResponse({ status: 201, description: 'Заказ успешно создан' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  @ApiBody({ type: CreateOrderClientDTO })
  async createOrderClient(
    @Param('id') clientId: string,
    @Body() createOrderClient: CreateOrderClientDTO,
  ) {
    return await this._clientService.createOrderClient(
      createOrderClient,
      clientId,
    );
  }

  @Post('docs/:id')
  @ApiOperation({ summary: 'Добавление документов для клиента' })
  @ApiResponse({ status: 201, description: 'Документы успешно добавлены' })
  @ApiResponse({ status: 404, description: 'Клиент или документы не найдены' })
  @ApiBody({ type: addDocsClientDTO })
  async addDocsClient(
    @Param('id') clientId: string,
    @Body() addDocsClient: addDocsClientDTO,
  ) {
    return await this._clientService.addDocsClient(addDocsClient, clientId);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление данных клиента' })
  @ApiResponse({ status: 200, description: 'Клиент успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Клиент не найден' })
  @ApiResponse({
    status: 409,
    description: 'Клиент с таким именем или ИНН уже существует',
  })
  @ApiBody({ type: UpdateClientDTO })
  async updateClient(
    @Param('id') id: string,
    @Body() updateClient: UpdateClientDTO,
    @Param('currentUserId') currentUserId: string,
  ) {
    return await this._clientService.updateClient(
      id,
      updateClient,
      currentUserId,
    );
  }

  @Put('users/:id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление данных пользователя клиента' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен' })
  @ApiResponse({
    status: 404,
    description: 'Клиент или пользователь не найдены',
  })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  @ApiBody({ type: UpdateUserClientDTO })
  async updateUserClient(
    @Param() currentUserId: string,
    @Body() updateUserClient: UpdateUserClientDTO,
  ) {
    return await this._clientService.updateUserClient(
      updateUserClient,
      currentUserId,
    );
  }

  @Put('orders/:orderId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновление данных заказа клиента' })
  @ApiResponse({ status: 200, description: 'Заказ успешно обновлен' })
  @ApiResponse({ status: 404, description: 'Заказ не найден' })
  @ApiBody({ type: UpdateOrderClientDTO })
  async updateOrderClient(
    @Param() id: string,
    @Param() currentUserId: string,
    @Body() updateOrderClient: UpdateOrderClientDTO,
  ) {
    return await this._clientService.updateOrderClient(
      id,
      updateOrderClient,
      currentUserId,
    );
  }
}
