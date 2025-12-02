import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({
    description: 'Order identifier',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @IsUUID()
  orderId: string;

  @ApiPropertyOptional({
    description: 'Product identifier',
    example: 'c1d2e3f4-5678-9101-1121-314151617181',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Product variant identifier',
    example: 'f1e2d3c4-b5a6-7890-1234-abcdefabcdef',
  })
  @IsOptional()
  @IsUUID()
  variantId?: string;

  @ApiProperty({
    description: 'Title snapshot stored with the order item',
    example: 'Eco-friendly Bamboo Toothbrush',
  })
  @IsString()
  @IsNotEmpty()
  titleSnapshot: string;

  @ApiProperty({
    description: 'Unit price charged for this item',
    example: 19.99,
  })
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Quantity purchased',
    example: 2,
  })
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  quantity: number;

  @ApiPropertyOptional({
    description: 'Currency ISO code',
    example: 'USD',
    default: 'INR',
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currencyCode?: string;
}

