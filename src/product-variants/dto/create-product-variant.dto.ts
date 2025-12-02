import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductVariantDto {
  @ApiProperty({
    description: 'Product identifier this variant belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @IsUUID()
  productId: string;

  @ApiPropertyOptional({
    description: 'Unique SKU for the variant',
    example: 'SKU-TOOTHBRUSH-BAMBOO-001',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    description: 'Variant-specific price',
    example: 21.99,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Strike-through price',
    example: 24.99,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ description: 'Stock level', example: 50, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Variant attributes JSON (e.g. size, color)',
    example: { size: 'L', color: 'Green' },
  })
  @IsOptional()
  @IsObject()
  attributes?: Record<string, any>;

  @ApiPropertyOptional({
    description: 'Whether this variant is active',
    example: true,
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  isActive?: boolean;
}

