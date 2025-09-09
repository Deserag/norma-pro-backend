import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  Delete,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDTO, GetListDTO, CreateRoleDTO } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  @ApiOperation({ summary: 'Получение пользователя по ID' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно получен' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  async getUserById(@Param('id') id: string, @Req() req) {
    return await this.userService.getUserById(id, req.user.sub);
  }

  @Get('roles/:id')
  @ApiOperation({ summary: 'Получение роли по ID' })
  @ApiResponse({ status: 200, description: 'Роль успешно получена' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  async getRoleById(@Param('id') id: string, @Req() req) {
    return await this.userService.getRoleById(parseInt(id), req.user.sub);
  }

  @Post('docs/:id')
  @ApiOperation({ summary: 'Получение списка документов пользователя' })
  @ApiResponse({
    status: 200,
    description: 'Список документов успешно получен',
  })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async getUserDocsList(
    @Param('id') id: string,
    @Body() getDocsDto: GetListDTO,
    @Req() req,
  ) {
    return await this.userService.getUserDocsList(getDocsDto, id, req.user.sub);
  }

  @Post()
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({ status: 201, description: 'Пользователь успешно создан' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto, @Req() req) {
    return await this.userService.createUser(createUserDto, req.user.sub);
  }

  @Post('list')
  @ApiOperation({ summary: 'Получение списка пользователей' })
  @ApiResponse({
    status: 200,
    description: 'Список пользователей успешно получен',
  })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async getUsersList(@Body() getUsersDto: GetListDTO, @Req() req) {
    return await this.userService.getUsersList(getUsersDto, req.user.sub);
  }

  @Post('roles')
  @ApiOperation({ summary: 'Создание роли' })
  @ApiResponse({ status: 201, description: 'Роль успешно создана' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({
    status: 409,
    description: 'Роль с таким именем уже существует',
  })
  @HttpCode(HttpStatus.CREATED)
  async createRole(@Body() createRoleDto: CreateRoleDTO) {
    return await this.userService.createRole(createRoleDto);
  }

  @Post('roles/list')
  @ApiOperation({ summary: 'Получение списка ролей' })
  @ApiResponse({ status: 200, description: 'Список ролей успешно получен' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  async getRolesList(@Body() getRolesDto: GetListDTO, @Req() req) {
    return await this.userService.getRolesList(getRolesDto, req.user.sub);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Обновление пользователя' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно обновлен' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @ApiResponse({
    status: 409,
    description: 'Пользователь с таким email уже существует',
  })
  @HttpCode(HttpStatus.OK)
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDTO,
    @Req() req,
  ) {
    return await this.userService.updateUser(id, updateUserDto, req.user.sub);
  }

  @Patch('roles/:id')
  @ApiOperation({ summary: 'Обновление роли' })
  @ApiResponse({ status: 200, description: 'Роль успешно обновлена' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  @ApiResponse({
    status: 409,
    description: 'Роль с таким именем уже существует',
  })
  @HttpCode(HttpStatus.OK)
  async updateRole(
    @Param('id') id: string,
    @Body() updateRoleDto: CreateRoleDTO,
    @Req() req,
  ) {
    return await this.userService.updateRole(
      parseInt(id),
      updateRoleDto,
      req.user.sub,
    );
  }

  @Delete('roles/:id')
  @ApiOperation({ summary: 'Удаление роли (мягкое удаление)' })
  @ApiResponse({ status: 200, description: 'Роль успешно удалена' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Роль не найдена' })
  @HttpCode(HttpStatus.OK)
  async deleteRole(@Param('id') id: string, @Req() req) {
    return await this.userService.deleteRole(parseInt(id), req.user.sub);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Удаление пользователя (мягкое удаление)' })
  @ApiResponse({ status: 200, description: 'Пользователь успешно удален' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Пользователь не найден' })
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string, @Req() req) {
    return await this.userService.deleteUser(id, req.user.sub);
  }
}
