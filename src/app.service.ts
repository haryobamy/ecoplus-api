import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  // constructor(@Inject('POSTGRES_POOL') private readonly sql: any) {}

  // async list(): Promise<any[]> {
  //   return this.sql`select * from playing_with_neon`;
  // }

  getHello(): string {
    return 'Hello World!';
  }
}
