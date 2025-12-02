import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/middlewares/error';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';
import { UpdateProductDto } from './dto/update-product.dto';

const defaultProductInclude = {
  brand: true,
  category: true,
  subCategory: true,
  thirdCategory: true,
  images: true,
  variants: true,
};

@Injectable()
export class ProductsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductDto: CreateProductDto) {
    try {
      const product = await this.databaseService.product.create({
        data: this.buildProductData(createProductDto),
        include: defaultProductInclude,
      });

      return {
        status: true,
        message: 'Product created successfully',
        data: product,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findAll(query: ProductQueryDto) {
    try {
      const { limit = 20, page = 1, ...filters } = query;
      const take = limit;
      const skip = (page - 1) * take;

      const where = this.buildQueryWhere(filters);

      const [items, total] = await this.databaseService.$transaction([
        this.databaseService.product.findMany({
          where,
          take,
          skip,
          orderBy: { createdAt: 'desc' },
          include: defaultProductInclude,
        }),
        this.databaseService.product.count({ where }),
      ]);

      return {
        status: true,
        message: 'Products retrieved successfully',
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
      const product = await this.databaseService.product.findUnique({
        where: { id },
        include: defaultProductInclude,
      });

      if (!product) {
        throw new NotFoundException('Product not found');
      }

      return {
        status: true,
        message: 'Product retrieved successfully',
        data: product,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw handlePrismaError(error);
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      const product = await this.databaseService.product.update({
        where: { id },
        data: this.buildProductData(updateProductDto),
        include: defaultProductInclude,
      });

      return {
        status: true,
        message: 'Product updated successfully',
        data: product,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.databaseService.product.delete({
        where: { id },
      });

      return {
        status: true,
        message: 'Product removed successfully',
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  private buildProductData(
    dto: Partial<CreateProductDto>,
  ): Prisma.ProductUncheckedCreateInput {
    const data: Prisma.ProductUncheckedCreateInput = {} as any;

    if (dto.title !== undefined) data.title = dto.title;
    if (dto.slug !== undefined) data.slug = dto.slug;
    if (dto.description !== undefined) data.description = dto.description;
    if (dto.price !== undefined) data.price = this.toDecimal(dto.price);
    if (dto.compareAtPrice !== undefined)
      data.compareAtPrice = this.toDecimal(dto.compareAtPrice);
    if (dto.currencyCode !== undefined) data.currencyCode = dto.currencyCode;
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    if (dto.brandId !== undefined) data.brandId = dto.brandId;
    if (dto.categoryId !== undefined) data.categoryId = dto.categoryId;
    if (dto.subCategoryId !== undefined) data.subCategoryId = dto.subCategoryId;
    if (dto.thirdCategoryId !== undefined)
      data.thirdCategoryId = dto.thirdCategoryId;

    return data;
  }

  private buildQueryWhere(
    filters: Omit<ProductQueryDto, 'limit' | 'page'>,
  ): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (filters.brandId) where.brandId = filters.brandId;
    if (filters.categoryId) where.categoryId = filters.categoryId;
    if (filters.subCategoryId) where.subCategoryId = filters.subCategoryId;
    if (filters.thirdCategoryId)
      where.thirdCategoryId = filters.thirdCategoryId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;

    if (filters.search) {
      where.OR = [
        {
          title: {
            contains: filters.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          description: {
            contains: filters.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ];
    }

    return where;
  }

  private toDecimal(value: number) {
    return new Prisma.Decimal(value);
  }
}
