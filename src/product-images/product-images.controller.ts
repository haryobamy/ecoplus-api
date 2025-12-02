import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { ProductImageQueryDto } from './dto/product-image-query.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImagesService } from './product-images.service';

@ApiTags('Product Images')
@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly productImagesService: ProductImagesService) {}

  @Post()
  @ApiOperation({ summary: 'Upload a product image' })
  create(@Body() createProductImageDto: CreateProductImageDto) {
    return this.productImagesService.create(createProductImageDto);
  }

  @Get()
  @ApiOperation({ summary: 'List product images' })
  findAll(@Query() query: ProductImageQueryDto) {
    return this.productImagesService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product image by id' })
  @ApiParam({ name: 'id', description: 'Product image identifier' })
  findOne(@Param('id') id: string) {
    return this.productImagesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a product image' })
  @ApiParam({ name: 'id', description: 'Product image identifier' })
  update(
    @Param('id') id: string,
    @Body() updateProductImageDto: UpdateProductImageDto,
  ) {
    return this.productImagesService.update(id, updateProductImageDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product image' })
  @ApiParam({ name: 'id', description: 'Product image identifier' })
  remove(@Param('id') id: string) {
    return this.productImagesService.remove(id);
  }
}

