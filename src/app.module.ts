import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';

import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { MyLoggerModule } from './my-logger/my-logger.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailerModule } from './mailer/mailer.module';

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
