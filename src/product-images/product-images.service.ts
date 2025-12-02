import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/middlewares/error';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductImageQueryDto } from './dto/product-image-query.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Injectable()
export class ProductImagesService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createProductImageDto: CreateProductImageDto) {
    try {
      const image = await this.databaseService.productImage.create({
        data: createProductImageDto,
      });
      return {
        status: true,
        message: 'Product image created successfully',
        data: image,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findAll(query: ProductImageQueryDto) {
    try {
      const { page = 1, limit = 20, ...filters } = query;
      const skip = (page - 1) * limit;
      const where: Prisma.ProductImageWhereInput = {};
      if (filters.productId) where.productId = filters.productId;
      if (filters.isPrimary !== undefined) where.isPrimary = filters.isPrimary;

      const [items, total] = await this.databaseService.$transaction([
        this.databaseService.productImage.findMany({
          where,
          skip,
          take: limit,
          orderBy: { position: 'asc' },
        }),
        this.databaseService.productImage.count({ where }),
      ]);

      return {
        status: true,
        message: 'Product images retrieved successfully',
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
      const image = await this.databaseService.productImage.findUnique({
        where: { id },
      });
      if (!image) throw new NotFoundException('Product image not found');
      return {
        status: true,
        message: 'Product image retrieved successfully',
        data: image,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw handlePrismaError(error);
    }
  }

  async update(id: string, updateProductImageDto: UpdateProductImageDto) {
    try {
      const image = await this.databaseService.productImage.update({
        where: { id },
        data: updateProductImageDto,
      });
      return {
        status: true,
        message: 'Product image updated successfully',
        data: image,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.databaseService.productImage.delete({
        where: { id },
      });
      return {
        status: true,
        message: 'Product image removed successfully',
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

