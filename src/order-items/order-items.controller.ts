import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateOrderItemDto } from './dto/create-order-item.dto';
import { OrderItemQueryDto } from './dto/order-item-query.dto';
import { UpdateOrderItemDto } from './dto/update-order-item.dto';
import { OrderItemsService } from './order-items.service';

@ApiTags('Order Items')
@Controller('order-items')
export class OrderItemsController {
  constructor(private readonly orderItemsService: OrderItemsService) {}

  @Post()
  @ApiOperation({ summary: 'Create an order item' })
  create(@Body() createOrderItemDto: CreateOrderItemDto) {
    return this.orderItemsService.create(createOrderItemDto);
  }

  @Get()
  @ApiOperation({ summary: 'List order items' })
  findAll(@Query() query: OrderItemQueryDto) {
    return this.orderItemsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an order item' })
  @ApiParam({ name: 'id', description: 'Order item identifier' })
  findOne(@Param('id') id: string) {
    return this.orderItemsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an order item' })
  @ApiParam({ name: 'id', description: 'Order item identifier' })
  update(
    @Param('id') id: string,
    @Body() updateOrderItemDto: UpdateOrderItemDto,
  ) {
    return this.orderItemsService.update(id, updateOrderItemDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an order item' })
  @ApiParam({ name: 'id', description: 'Order item identifier' })
  remove(@Param('id') id: string) {
    return this.orderItemsService.remove(id);
  }
}

