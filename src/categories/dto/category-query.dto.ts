import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

export class CategoryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by level', example: 2 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  level?: number;

  @ApiPropertyOptional({
    description: 'Filter by parent category id',
    example: 'c889f3d4-8a4f-4cb7-8b2f-1b2c3d4e5f6a',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @ApiPropertyOptional({
    description: 'Filter by active status',
    example: true,
  })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Search across name/slug',
    example: 'electronics',
  })
  @IsOptional()
  @IsString()
  search?: string;
}

