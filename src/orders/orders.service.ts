import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { handlePrismaError } from 'src/middlewares/error';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderQueryDto } from './dto/order-query.dto';
import { UpdateOrderDto } from './dto/update-order.dto';

const defaultOrderInclude = {
  user: true,
  items: true,
};

@Injectable()
export class OrdersService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.databaseService.order.create({
        data: this.buildOrderData(createOrderDto),
        include: defaultOrderInclude,
      });
      return {
        status: true,
        message: 'Order created successfully',
        data: order,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async findAll(query: OrderQueryDto) {
    try {
      const { page = 1, limit = 20, ...filters } = query;
      const skip = (page - 1) * limit;
      const where = this.buildWhere(filters);

      const [items, total] = await this.databaseService.$transaction([
        this.databaseService.order.findMany({
          where,
          skip,
          take: limit,
          orderBy: { placedAt: 'desc' },
          include: defaultOrderInclude,
        }),
        this.databaseService.order.count({ where }),
      ]);

      return {
        status: true,
        message: 'Orders retrieved successfully',
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
      const order = await this.databaseService.order.findUnique({
        where: { id },
        include: defaultOrderInclude,
      });
      if (!order) throw new NotFoundException('Order not found');
      return {
        status: true,
        message: 'Order retrieved successfully',
        data: order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw handlePrismaError(error);
    }
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    try {
      const order = await this.databaseService.order.update({
        where: { id },
        data: this.buildOrderData(updateOrderDto),
        include: defaultOrderInclude,
      });
      return {
        status: true,
        message: 'Order updated successfully',
        data: order,
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  async remove(id: string) {
    try {
      await this.databaseService.order.delete({
        where: { id },
      });
      return {
        status: true,
        message: 'Order removed successfully',
      };
    } catch (error) {
      throw handlePrismaError(error);
    }
  }

  private buildOrderData(
    dto: Partial<CreateOrderDto>,
  ): Prisma.OrderUncheckedCreateInput {
    const data: Prisma.OrderUncheckedCreateInput = {} as any;
    if (dto.orderNumber !== undefined) data.orderNumber = dto.orderNumber;
    if (dto.userId !== undefined) data.userId = dto.userId;
    if (dto.status !== undefined) data.status = dto.status;
    if (dto.paymentMethod !== undefined) data.paymentMethod = dto.paymentMethod;
    if (dto.paymentId !== undefined) data.paymentId = dto.paymentId;
    if (dto.totalAmount !== undefined)
      data.totalAmount = new Prisma.Decimal(dto.totalAmount);
    if (dto.currencyCode !== undefined) data.currencyCode = dto.currencyCode;
    if (dto.recipientName !== undefined)
      data.recipientName = dto.recipientName;
    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.addressLine !== undefined) data.addressLine = dto.addressLine;
    if (dto.pincode !== undefined) data.pincode = dto.pincode;
    if (dto.email !== undefined) data.email = dto.email;
    return data;
  }

  private buildWhere(
    filters: Omit<OrderQueryDto, 'page' | 'limit'>,
  ): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        {
          orderNumber: {
            contains: filters.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          recipientName: {
            contains: filters.search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ];
    }
    return where;
  }
}

