import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateOrderDto {
  @ApiProperty({
    description: 'Unique order number',
    example: 'ORD-2024-0001',
  })
  @IsString()
  @IsNotEmpty()
  orderNumber: string;

  @ApiPropertyOptional({
    description: 'User identifier if the order is associated with a user account',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @IsOptional()
  @IsUUID()
  userId?: string;

  @ApiProperty({
    description: 'Current order status',
    enum: OrderStatus,
    example: OrderStatus.PENDING,
  })
  @IsEnum(OrderStatus)
  status: OrderStatus;

  @ApiProperty({
    description: 'Payment method e.g., card, COD',
    example: 'CARD',
  })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string;

  @ApiPropertyOptional({
    description: 'Payment reference id (if any)',
    example: 'PAY-XYZ-123',
  })
  @IsOptional()
  @IsString()
  paymentId?: string;

  @ApiProperty({ description: 'Total amount charged', example: 129.99 })
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  totalAmount: number;

  @ApiPropertyOptional({
    description: 'Currency ISO code',
    example: 'USD',
    default: 'INR',
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currencyCode?: string;

  @ApiProperty({
    description: 'Recipient full name',
    example: 'Jane Doe',
  })
  @IsString()
  @IsNotEmpty()
  recipientName: string;

  @ApiPropertyOptional({
    description: 'Recipient phone number',
    example: '+1-555-1234',
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    description: 'Delivery address',
    example: '123 Palm Street, Springfield',
  })
  @IsString()
  @IsNotEmpty()
  addressLine: string;

  @ApiPropertyOptional({
    description: 'Recipient postal code',
    example: '90001',
  })
  @IsOptional()
  @IsString()
  pincode?: string;

  @ApiPropertyOptional({
    description: 'Recipient email address',
    example: 'jane@example.com',
  })
  @IsOptional()
  @IsEmail()
  email?: string;
}

