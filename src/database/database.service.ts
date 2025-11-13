import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // private readonly sql;

  // constructor(private configService: ConfigService) {
  //   const databaseUrl = this.configService.get('DATABASE_URL');
  //   this.sql = neon(databaseUrl);
  // }

  async onModuleInit() {
    console.log('🟢 Connected to DB:', process.env.DATABASE_URL);
    await this.$connect();
    const db = await this.$queryRawUnsafe(
      `SELECT current_database() as db, current_schema() as schema;`,
    );
    console.log('✅ Connected to:', db);
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
  // async getData() {
  //   const data = await this.sql`...`;
  //   return data;
  // }
}
