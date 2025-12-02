import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class OrderItemQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by order id',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @IsOptional()
  @IsUUID()
  orderId?: string;
}

