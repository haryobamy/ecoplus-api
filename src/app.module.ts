import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { BrandsModule } from './brands/brands.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { ProductVariantsModule } from './product-variants/product-variants.module';
import { OrdersModule } from './orders/orders.module';
import { OrderItemsModule } from './order-items/order-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule,
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000, // not more than 4 request in 1sec
        limit: 4,
      },
      {
        name: 'long',
        ttl: 60000, // not more than 100 request in 1min
        limit: 100,
      },
    ]),

    UsersModule,
    MyLoggerModule,
    AuthModule,
    MailerModule,
    ProductsModule,
    CategoriesModule,
    BrandsModule,
    ProductImagesModule,
    ProductVariantsModule,
    OrdersModule,
    OrderItemsModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerModule,
    },
  ],
})
export class AppModule {}
