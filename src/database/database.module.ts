import { Module } from '@nestjs/common';
import { DatabaseService } from './database.service';

// config({ path: ['.env', '.env.local', '.env.production'] });

// const sql = neon(process.env.DATABASE_URL!);

// const dbProvider = {
//   provide: 'POSTGRES_POOL',
//   useValue: sql,
// };

@Module({
  // imports: [ConfigModule],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
