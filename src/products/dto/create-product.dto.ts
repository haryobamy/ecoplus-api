import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Product title',
    example: 'Eco-friendly Bamboo Toothbrush',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    description: 'Unique slug used for SEO friendly URLs',
    example: 'eco-friendly-bamboo-toothbrush',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({
    description: 'Detailed description of the product',
    example: 'A sustainable toothbrush made from bamboo.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: 'Product price',
    example: 19.99,
  })
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  price: number;

  @ApiPropertyOptional({
    description: 'Strikethrough price or MSRP',
    example: 24.99,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber({ allowInfinity: false, allowNaN: false })
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({
    description: 'Currency ISO code',
    example: 'USD',
    default: 'INR',
  })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currencyCode?: string;

  @ApiPropertyOptional({
    description: 'Available stock',
    example: 100,
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({
    description: 'Flag to indicate if product is active',
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Brand identifier',
    example: 'f6f3fbf5-5f9b-41d2-857c-4b2a2c9b6a5d',
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({
    description: 'Primary category identifier',
    example: 'c889f3d4-8a4f-4cb7-8b2f-1b2c3d4e5f6a',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Sub category identifier',
    example: '9b6c2d3f-1a2b-4c5d-6e7f-8a9b0c1d2e3f',
  })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @ApiPropertyOptional({
    description: 'Third level category identifier',
    example: '6c4d2e1f-9a8b-7c6d-5e4f-3a2b1c0d9e8f',
  })
  @IsOptional()
  @IsUUID()
  thirdCategoryId?: string;
}

