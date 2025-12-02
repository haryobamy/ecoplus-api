import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateProductImageDto {
  @ApiProperty({
    description: 'Product identifier the image belongs to',
    example: 'a1b2c3d4-e5f6-7890-abcd-1234567890ab',
  })
  @IsUUID()
  productId: string;

  @ApiProperty({
    description: 'Image URL',
    example: 'https://cdn.example.com/products/image.jpg',
  })
  @IsString()
  @IsNotEmpty()
  url: string;

  @ApiPropertyOptional({
    description: 'Alt text for the image',
    example: 'Front view of the bamboo toothbrush',
  })
  @IsOptional()
  @IsString()
  alt?: string;

  @ApiPropertyOptional({
    description: 'Flag to mark as primary image',
    default: false,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Display order of the image',
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  position?: number;
}

