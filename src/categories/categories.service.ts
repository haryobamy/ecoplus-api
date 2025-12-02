import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/middlewares/error';
import { CategoryQueryDto } from './dto/category-query.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    try {
      console.log(createCategoryDto);
      const category = await this.databaseService.category.create({
        data: createCategoryDto,
      });
      return {
        status: true,
        message: 'Category created successfully',
        data: category,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findAll(query: CategoryQueryDto) {
    try {
      const { page = 1, limit = 20, ...filters } = query;
      const skip = (page - 1) * limit;
      const where = this.buildWhere(filters);

      const [items, total] = await this.databaseService.$transaction([
        this.databaseService.category.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: { parent: true, children: true },
        }),
        this.databaseService.category.count({ where }),
      ]);

      return {
        status: true,
        message: 'Categories retrieved successfully',
        data: {
          items,
          meta: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.databaseService.category.findUnique({
        where: { id },
        include: { parent: true, children: true },
      });
      if (!category) throw new NotFoundException('Category not found');
      return {
        status: true,
        message: 'Category retrieved successfully',
        data: category,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw handlePrismaError(error);
    }
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    try {
      const category = await this.databaseService.category.update({
        where: { id },
        data: updateCategoryDto,
        include: { parent: true, children: true },
      });
      return {
        status: true,
        message: 'Category updated successfully',
        data: category,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.databaseService.category.delete({
        where: { id },
      });
      return {
        status: true,
        message: 'Category removed successfully',
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  private buildWhere(
    filters: Omit<CategoryQueryDto, 'page' | 'limit'>,
  ): Prisma.CategoryWhereInput {
    const where: Prisma.CategoryWhereInput = {};
    if (filters.level) where.level = filters.level;
    if (filters.parentId) where.parentId = filters.parentId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    if (filters.search) {
      where.OR = [
        {
          name: { contains: filters.search, mode: 'insensitive' },
        },
        {
          slug: { contains: filters.search, mode: 'insensitive' },
        },
      ];
    }
    return where;
  }
}
