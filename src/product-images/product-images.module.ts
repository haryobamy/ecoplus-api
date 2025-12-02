import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { ProductImagesController } from './product-images.controller';
import { ProductImagesService } from './product-images.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ProductImagesController],
  providers: [ProductImagesService],
})
export class ProductImagesModule {}

