import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category name', example: 'Electronics' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: 'Unique slug', example: 'electronics' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiProperty({
    description: 'Category level (1, 2, or 3)',
    example: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  level: number;

  @ApiPropertyOptional({
    description: 'Whether the category is active',
    default: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Parent category id for nested levels',
    example: 'c889f3d4-8a4f-4cb7-8b2f-1b2c3d4e5f6a',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}

