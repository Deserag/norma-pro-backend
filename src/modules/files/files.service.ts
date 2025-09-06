import {
  Injectable,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma';
import {
  CreateFileDTO,
  UpdateFileDTO,
  GetFilesDTO,
  CreateTagDTO,
  CreateCategoryDTO,
  GetTagsDTO,
  GetCategoriesDTO,
} from './dto';
import { Prisma, DocumentKind } from '@prisma/client';
import { Multer } from 'multer';
@Injectable()
export class FileService {
  constructor(private _prisma: PrismaService) {}

  async getDocumentById(id: string, currentUserId: string) {
    const document = await this._prisma.document.findUnique({
      where: { id, deletedAt: null },
      include: {
        type: true,
        status: true,
        currentVersion: true,
        tags: { include: { tag: true } },
        creator: { select: { id: true, email: true, fullName: true } },
        originalDocument: {
          select: { id: true, title: true, documentKind: true },
        },
        derivedDocuments: {
          select: { id: true, title: true, documentKind: true },
        },
      },
    });
    if (!document) {
      throw new NotFoundException('Документ не найден');
    }
    const isAdmin = await this.isSuperAdmin(currentUserId);
    if (!isAdmin && document.createdById !== currentUserId) {
      throw new ForbiddenException('Доступ запрещен');
    }
    return document;
  }

  async getDocuments(getFilesDto: GetFilesDTO, currentUserId: string) {
    const isAdmin = await this.isSuperAdmin(currentUserId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'Только SuperAdmin может просматривать список документов',
      );
    }

    const {
      page = 1,
      size = 10,
      tagIds,
      categoryIds,
      language,
      typeId,
      statusId,
      documentKind,
      originalDocumentId,
      orderBy = 'createdAt',
      orderDirection = 'desc',
    } = getFilesDto;

    const where: Prisma.DocumentWhereInput = { deletedAt: null };
    if (tagIds?.length) {
      where.tags = { some: { tagId: { in: tagIds } } };
    }
    if (categoryIds?.length) {
      where.tags = {
        some: {
          tag: { categories: { some: { categoryId: { in: categoryIds } } } },
        },
      };
    }
    if (language) {
      where.language = language;
    }
    if (typeId) {
      where.typeId = typeId;
    }
    if (statusId) {
      where.statusId = statusId;
    }
    if (documentKind) {
      where.documentKind = documentKind;
    }
    if (originalDocumentId) {
      where.originalDocumentId = originalDocumentId;
    }

    const [rows, totalCount] = await this._prisma.$transaction([
      this._prisma.document.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { [orderBy]: orderDirection },
        include: {
          type: { select: { id: true, name: true } },
          status: { select: { id: true, name: true } },
          currentVersion: true,
          tags: {
            include: {
              tag: { include: { categories: { include: { category: true } } } },
            },
          },
          creator: { select: { id: true, email: true, fullName: true } },
          originalDocument: {
            select: { id: true, title: true, documentKind: true },
          },
          derivedDocuments: {
            select: { id: true, title: true, documentKind: true },
          },
        },
      }),
      this._prisma.document.count({ where }),
    ]);

    return {
      rows,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
      currentPage: page,
    };
  }

  async createDocument(
    createFileDto: CreateFileDTO,
    file: Multer | undefined,
    currentUserId: string,
  ) {
    const isAdmin = await this.isSuperAdmin(currentUserId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'Только SuperAdmin может добавлять документы',
      );
    }

    if (!file) {
      throw new BadRequestException('Файл не загружен');
    }

    const filePath = `uploads/documents/${file}`;

    const document = await this._prisma.document.create({
      data: {
        code: createFileDto.code,
        title: createFileDto.title,
        typeId: createFileDto.typeId,
        statusId: createFileDto.statusId,
        description: createFileDto.description,
        originalDocumentId: createFileDto.originalDocumentId,
        documentKind: createFileDto.documentKind ?? DocumentKind.ORIGINAL,
        language: createFileDto.language,
        createdById: currentUserId,
        versions: {
          create: {
            versionLabel: '1.0',
            fileUrl: filePath,
            isCurrent: true,
            createdById: currentUserId,
          },
        },
        tags: createFileDto.tagIds
          ? {
              create: createFileDto.tagIds.map((tagId) => ({
                tagId,
                createdById: currentUserId,
              })),
            }
          : undefined,
      },
    });

    if (createFileDto.categoryIds && createFileDto.tagIds) {
      for (const tagId of createFileDto.tagIds) {
        for (const categoryId of createFileDto.categoryIds) {
          await this._prisma.tagCategoryTag.create({
            data: {
              tagId,
              categoryId,
              createdById: currentUserId,
            },
          });
        }
      }
    }

    return document;
  }

  async updateDocument(
    id: string,
    updateFileDto: UpdateFileDTO,
    file: Multer | undefined,
    currentUserId: string,
  ) {
    const isAdmin = await this.isSuperAdmin(currentUserId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'Только SuperAdmin может обновлять документы',
      );
    }

    const document = await this._prisma.document.findUnique({
      where: { id, deletedAt: null },
    });
    if (!document) {
      throw new NotFoundException('Документ не найден');
    }

    const data: Prisma.DocumentUpdateInput = {
      code: updateFileDto.code,
      title: updateFileDto.title,
      type: { connect: { id: updateFileDto.typeId } },
      status: { connect: { id: updateFileDto.statusId } },
      description: updateFileDto.description,
      originalDocument: updateFileDto.originalDocumentId
        ? { connect: { id: updateFileDto.originalDocumentId } }
        : undefined,
      documentKind: updateFileDto.documentKind ?? document.documentKind,
      language: updateFileDto.language,
      updatedAt: new Date(),
    };

    if (file) {
      const filePath = `uploads/documents/${file}`;
      data.versions = {
        create: {
          versionLabel: 'new-version',
          fileUrl: filePath,
          isCurrent: true,
          createdById: currentUserId,
        },
      };
    }

    if (updateFileDto.tagIds) {
      await this._prisma.documentTag.deleteMany({ where: { documentId: id } });
      data.tags = {
        create: updateFileDto.tagIds.map((tagId) => ({
          tagId,
          createdById: currentUserId,
        })),
      };
    }

    if (updateFileDto.categoryIds && updateFileDto.tagIds) {
      for (const tagId of updateFileDto.tagIds) {
        await this._prisma.tagCategoryTag.deleteMany({ where: { tagId } });
        for (const categoryId of updateFileDto.categoryIds) {
          await this._prisma.tagCategoryTag.create({
            data: {
              tagId,
              categoryId,
              createdById: currentUserId,
            },
          });
        }
      }
    }

    return await this._prisma.document.update({
      where: { id },
      data,
    });
  }

  async createTag(createTagDto: CreateTagDTO, currentUserId: string) {
    const isAdmin = await this.isSuperAdmin(currentUserId);
    if (!isAdmin) {
      throw new ForbiddenException('Только SuperAdmin может добавлять теги');
    }

    const tag = await this._prisma.tag.create({
      data: {
        name: createTagDto.name,
        tagType: createTagDto.tagType,
        createdById: currentUserId,
      },
    });

    if (createTagDto.categoryIds) {
      for (const categoryId of createTagDto.categoryIds) {
        await this._prisma.tagCategoryTag.create({
          data: {
            tagId: tag.id,
            categoryId,
            createdById: currentUserId,
          },
        });
      }
    }

    return tag;
  }

  async createCategory(
    createCategoryDto: CreateCategoryDTO,
    currentUserId: string,
  ) {
    const isAdmin = await this.isSuperAdmin(currentUserId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'Только SuperAdmin может добавлять категории',
      );
    }

    return await this._prisma.tagCategory.create({
      data: {
        name: createCategoryDto.name,
        createdById: currentUserId,
      },
    });
  }

  async getTags(getTagsDto: GetTagsDTO, currentUserId: string) {
    const isAdmin = await this.isSuperAdmin(currentUserId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'Только SuperAdmin может просматривать список тегов',
      );
    }

    const { page = 1, size = 10, tagType } = getTagsDto;

    const where: Prisma.TagWhereInput = { deletedAt: null };
    if (tagType) {
      where.tagType = tagType;
    }

    const [rows, totalCount] = await this._prisma.$transaction([
      this._prisma.tag.findMany({
        where,
        skip: (page - 1) * size,
        take: size,
        orderBy: { createdAt: 'desc' },
        include: { categories: { include: { category: true } } },
      }),
      this._prisma.tag.count({ where }),
    ]);

    return {
      rows,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
      currentPage: page,
    };
  }

  async getCategories(
    getCategoriesDto: GetCategoriesDTO,
    currentUserId: string,
  ) {
    const isAdmin = await this.isSuperAdmin(currentUserId);
    if (!isAdmin) {
      throw new ForbiddenException(
        'Только SuperAdmin может просматривать список категорий',
      );
    }

    const { page = 1, size = 10 } = getCategoriesDto;

    const [rows, totalCount] = await this._prisma.$transaction([
      this._prisma.tagCategory.findMany({
        skip: (page - 1) * size,
        take: size,
        where: { deletedAt: null },
        orderBy: { createdAt: 'desc' },
        include: { tags: { include: { tag: true } } },
      }),
      this._prisma.tagCategory.count({ where: { deletedAt: null } }),
    ]);

    return {
      rows,
      totalCount,
      totalPages: Math.ceil(totalCount / size),
      currentPage: page,
    };
  }

  private async isSuperAdmin(userId: string): Promise<boolean> {
    const membership = await this._prisma.membership.findFirst({
      where: { userId, deletedAt: null },
      include: { role: true },
    });
    return membership?.role.name === 'SuperAdmin';
  }
}
