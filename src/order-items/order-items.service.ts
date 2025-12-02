import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/middlewares/error';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderItemQueryDto } from './dto/order-item-query.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';

@Injectable()
export class OrderItemsService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    try {
      const orderItem = await this.databaseService.orderItem.create({
        data: this.buildOrderItemData(createOrderItemDto),
      });
      return {
        status: true,
        message: 'Order item created successfully',
        data: orderItem,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findAll(query: OrderItemQueryDto) {
    try {
      const { page = 1, limit = 20, orderId } = query;
      const skip = (page - 1) * limit;
      const where: Prisma.OrderItemWhereInput = {};
      if (orderId) where.orderId = orderId;

      const [items, total] = await this.databaseService.$transaction([
        this.databaseService.orderItem.findMany({
          where,
          skip,
          take: limit,
          orderBy: {
            order: {
              placedAt: 'desc',
            },
          },
          include: { order: true, product: true, variant: true },
        }),
        this.databaseService.orderItem.count({ where }),
      ]);

      return {
        status: true,
        message: 'Order items retrieved successfully',
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
      const orderItem = await this.databaseService.orderItem.findUnique({
        where: { id },
        include: { order: true, product: true, variant: true },
      });
      if (!orderItem) throw new NotFoundException('Order item not found');
      return {
        status: true,
        message: 'Order item retrieved successfully',
        data: orderItem,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw handlePrismaError(error);
    }
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    try {
      const orderItem = await this.databaseService.orderItem.update({
        where: { id },
        data: this.buildOrderItemData(updateOrderItemDto),
        include: { order: true, product: true, variant: true },
      });
      return {
        status: true,
        message: 'Order item updated successfully',
        data: orderItem,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.databaseService.orderItem.delete({
        where: { id },
      });
      return {
        status: true,
        message: 'Order item removed successfully',
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  private buildOrderItemData(
    dto: Partial<CreateOrderItemDto>,
  ): Prisma.OrderItemUncheckedCreateInput {
    const data: Prisma.OrderItemUncheckedCreateInput = {} as any;
    if (dto.orderId !== undefined) data.orderId = dto.orderId;
    if (dto.productId !== undefined) data.productId = dto.productId;
    if (dto.variantId !== undefined) data.variantId = dto.variantId;
    if (dto.titleSnapshot !== undefined) data.titleSnapshot = dto.titleSnapshot;
    if (dto.price !== undefined) data.price = new Prisma.Decimal(dto.price);
    if (dto.quantity !== undefined) data.quantity = dto.quantity;
    if (dto.currencyCode !== undefined) data.currencyCode = dto.currencyCode;
    return data;
  }
}
