import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './files.service';
import {
  CreateFileDTO,
  GetFilesDTO,
  CreateTagDTO,
  CreateCategoryDTO,
  GetTagsDTO,
  GetCategoriesDTO,
} from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateFileDTO } from './dto';
import { diskStorage } from 'multer';

@ApiTags('files')
@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = file.originalname.split('.').pop();
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}.${fileExtName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreateFileDTO })
  @ApiOperation({ summary: 'Добавление файла/документа' })
  @ApiResponse({ status: 201, description: 'Документ успешно создан' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @HttpCode(HttpStatus.CREATED)
  async createDocument(
    @UploadedFile() file: any | undefined,
    @Body() createFileDto: CreateFileDTO,
    @Req() req,
  ) {
    return await this.fileService.createDocument(
      createFileDto,
      file,
      req.user.sub,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получение документа по ID' })
  @ApiResponse({ status: 200, description: 'Документ успешно получен' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Документ не найден' })
  @HttpCode(HttpStatus.OK)
  async getDocumentById(@Param('id') id: string, @Req() req) {
    return await this.fileService.getDocumentById(id, req.user.sub);
  }

  @Post('list')
  @ApiOperation({ summary: 'Получение списка документов с фильтрами' })
  @ApiResponse({
    status: 200,
    description: 'Список документов успешно получен',
  })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @HttpCode(HttpStatus.OK)
  async getDocuments(@Body() getFilesDto: GetFilesDTO, @Req() req) {
    return await this.fileService.getDocuments(getFilesDto, req.user.sub);
  }

  @Post('tags')
  @ApiOperation({ summary: 'Добавление тега' })
  @ApiResponse({ status: 201, description: 'Тег успешно создан' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @HttpCode(HttpStatus.CREATED)
  async createTag(@Body() createTagDto: CreateTagDTO, @Req() req) {
    return await this.fileService.createTag(createTagDto, req.user.sub);
  }

  @Post('categories')
  @ApiOperation({ summary: 'Добавление категории' })
  @ApiResponse({ status: 201, description: 'Категория успешно создана' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @HttpCode(HttpStatus.CREATED)
  async createCategory(
    @Body() createCategoryDto: CreateCategoryDTO,
    @Req() req,
  ) {
    return await this.fileService.createCategory(
      createCategoryDto,
      req.user.sub,
    );
  }

  @Post('tags/list')
  @ApiOperation({ summary: 'Получение списка тегов' })
  @ApiResponse({ status: 200, description: 'Список тегов успешно получен' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @HttpCode(HttpStatus.OK)
  async getTags(@Body() getTagsDto: GetTagsDTO, @Req() req) {
    return await this.fileService.getTags(getTagsDto, req.user.sub);
  }

  @Post('categories/list')
  @ApiOperation({ summary: 'Получение списка категорий' })
  @ApiResponse({ status: 200, description: 'Список категорий успешно получен' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @HttpCode(HttpStatus.OK)
  async getCategories(@Body() getCategoriesDto: GetCategoriesDTO, @Req() req) {
    return await this.fileService.getCategories(getCategoriesDto, req.user.sub);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads/documents',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtName = file.originalname.split('.').pop();
          const randomName = Array(4)
            .fill(null)
            .map(() => Math.round(Math.random() * 16).toString(16))
            .join('');
          callback(null, `${name}-${randomName}.${fileExtName}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdateFileDTO })
  @ApiOperation({ summary: 'Обновление документа' })
  @ApiResponse({ status: 200, description: 'Документ успешно обновлен' })
  @ApiResponse({ status: 403, description: 'Доступ запрещен' })
  @ApiResponse({ status: 404, description: 'Документ не найден' })
  @HttpCode(HttpStatus.OK)
  async updateDocument(
    @Param('id') id: string,
    @UploadedFile() file: any | undefined,
    @Body() updateFileDto: UpdateFileDTO,
    @Req() req,
  ) {
    return await this.fileService.updateDocument(
      id,
      updateFileDto,
      file,
      req.user.sub,
    );
  }
}
