import { Body, Controller, Get, Param, Post, Put, Delete } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ClientService } from './client.service';

@ApiTags('client')
@Controller('client')
export class ClientController {
  constructor(private readonly _clientService: ClientService) {}
}