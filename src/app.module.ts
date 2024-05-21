import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DataModule } from './data/data.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Customer } from './data/entities/customer.entity';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_SQL_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_SQL_HOST) || 5432,
      username: process.env.POSTGRES_SQL_USERNAME || 'postgres',
      password: process.env.POSTGRES_SQL_PASSWORD || 'postgres',
      database: process.env.POSTGRES_SQL_DATABASE || 'nfc-tron',
      entities: [Customer],
      synchronize: false,
    }),
    DataModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
