import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/middlewares/error';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createBrandDto: CreateBrandDto) {
    try {
      const brand = await this.databaseService.brand.create({
        data: createBrandDto,
      });
      return {
        status: true,
        message: 'Brand created successfully',
        data: brand,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findAll() {
    try {
      const brands = await this.databaseService.brand.findMany({
        orderBy: { name: 'asc' },
      });
      return {
        status: true,
        message: 'Brands retrieved successfully',
        data: brands,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findOne(id: string) {
    try {
      const brand = await this.databaseService.brand.findUnique({
        where: { id },
      });
      if (!brand) throw new NotFoundException('Brand not found');
      return {
        status: true,
        message: 'Brand retrieved successfully',
        data: brand,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw handlePrismaError(error);
    }
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    try {
      const brand = await this.databaseService.brand.update({
        where: { id },
        data: updateBrandDto,
      });
      return {
        status: true,
        message: 'Brand updated successfully',
        data: brand,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.databaseService.brand.delete({
        where: { id },
      });
      return {
        status: true,
        message: 'Brand removed successfully',
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }
}

