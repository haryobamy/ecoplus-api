import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class ProductQueryDto {
  @ApiPropertyOptional({
    description: 'Free text search across title and description',
    example: 'bamboo',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    description: 'Filter by category id',
    example: 'c889f3d4-8a4f-4cb7-8b2f-1b2c3d4e5f6a',
  })
  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by sub category id',
    example: '9b6c2d3f-1a2b-4c5d-6e7f-8a9b0c1d2e3f',
  })
  @IsOptional()
  @IsUUID()
  subCategoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by third category id',
    example: '6c4d2e1f-9a8b-7c6d-5e4f-3a2b1c0d9e8f',
  })
  @IsOptional()
  @IsUUID()
  thirdCategoryId?: string;

  @ApiPropertyOptional({
    description: 'Filter by brand id',
    example: 'f6f3fbf5-5f9b-41d2-857c-4b2a2c9b6a5d',
  })
  @IsOptional()
  @IsUUID()
  brandId?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Results per page',
    example: 20,
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({
    description: 'Page number (1-indexed)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;
}

