import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MailerModule } from 'src/mailer/mailer.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule, MailerModule],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
