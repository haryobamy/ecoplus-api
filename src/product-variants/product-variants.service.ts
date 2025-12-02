import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/middlewares/error';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantQueryDto } from './dto/product-variant-query.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';

@Injectable()
export class ProductVariantsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductVariantDto: CreateProductVariantDto) {
    try {
      const variant = await this.databaseService.productVariant.create({
        data: this.buildVariantData(createProductVariantDto),
      });

      return {
        status: true,
        message: 'Product variant created successfully',
        data: variant,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findAll(query: ProductVariantQueryDto) {
    try {
      const { page = 1, limit = 20, ...filters } = query;
      const skip = (page - 1) * limit;
      const where: Prisma.ProductVariantWhereInput = {};
      if (filters.productId) where.productId = filters.productId;
      if (filters.isActive !== undefined) where.isActive = filters.isActive;

      const [items, total] = await this.databaseService.$transaction([
        this.databaseService.productVariant.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        this.databaseService.productVariant.count({ where }),
      ]);

      return {
        status: true,
        message: 'Product variants retrieved successfully',
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
      const variant = await this.databaseService.productVariant.findUnique({
        where: { id },
      });
      if (!variant) throw new NotFoundException('Product variant not found');
      return {
        status: true,
        message: 'Product variant retrieved successfully',
        data: variant,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw handlePrismaError(error);
    }
  }

  async update(id: string, updateProductVariantDto: UpdateProductVariantDto) {
    try {
      const variant = await this.databaseService.productVariant.update({
        where: { id },
        data: this.buildVariantData(updateProductVariantDto),
      });
      return {
        status: true,
        message: 'Product variant updated successfully',
        data: variant,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.databaseService.productVariant.delete({
        where: { id },
      });
      return {
        status: true,
        message: 'Product variant removed successfully',
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  private buildVariantData(
    dto: Partial<CreateProductVariantDto>,
  ): Prisma.ProductVariantUncheckedCreateInput {
    const data: Prisma.ProductVariantUncheckedCreateInput = {} as any;
    if (dto.productId !== undefined) data.productId = dto.productId;
    if (dto.sku !== undefined) data.sku = dto.sku;
    if (dto.price !== undefined) data.price = this.toDecimal(dto.price);
    if (dto.compareAtPrice !== undefined)
      data.compareAtPrice = this.toDecimal(dto.compareAtPrice);
    if (dto.stock !== undefined) data.stock = dto.stock;
    if (dto.attributes !== undefined) data.attributes = dto.attributes as any;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;
    return data;
  }

  private toDecimal(value?: number) {
    if (value === undefined || value === null) return undefined;
    return new Prisma.Decimal(value);
  }
}

