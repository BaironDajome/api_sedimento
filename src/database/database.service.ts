import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    private readonly configService: ConfigService,
    private readonly dataSource: DataSource
  ) {}

  getDatabaseConfig() {
    return {
      database: this.configService.get<string>('DB_NAME'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
    };
  }

  getConnection() {
    return this.dataSource;
  }

  async query(query: string, params?: any[]) {
    try {
      return await this.dataSource.query(query, params);
    } catch (error) {
      console.error('Error ejecutando la consulta:', query, 'Error:', error.message);
      throw error;
    }
  }
}


