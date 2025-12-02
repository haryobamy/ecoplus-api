import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProductVariantDto } from './dto/create-product-variant.dto';
import { ProductVariantQueryDto } from './dto/product-variant-query.dto';
import { UpdateProductVariantDto } from './dto/update-product-variant.dto';
import { ProductVariantsService } from './product-variants.service';

@ApiTags('Product Variants')
@Controller('product-variants')
export class ProductVariantsController {
  constructor(private readonly productVariantsService: ProductVariantsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a product variant' })
  create(@Body() createProductVariantDto: CreateProductVariantDto) {
    return this.productVariantsService.create(createProductVariantDto);
  }

  @Get()
  @ApiOperation({ summary: 'List product variants' })
  findAll(@Query() query: ProductVariantQueryDto) {
    return this.productVariantsService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product variant' })
  @ApiParam({ name: 'id', description: 'Product variant identifier' })
  findOne(@Param('id') id: string) {
    return this.productVariantsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product variant' })
  @ApiParam({ name: 'id', description: 'Product variant identifier' })
  update(
    @Param('id') id: string,
    @Body() updateProductVariantDto: UpdateProductVariantDto,
  ) {
    return this.productVariantsService.update(id, updateProductVariantDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product variant' })
  @ApiParam({ name: 'id', description: 'Product variant identifier' })
  remove(@Param('id') id: string) {
    return this.productVariantsService.remove(id);
  }
}

