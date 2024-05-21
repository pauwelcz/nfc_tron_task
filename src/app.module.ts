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
      type: 'mysql',
      host: process.env.MYSQL_SQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_SQL_PORT) || 3306,
      username: process.env.MYSQL_ROOT_PASSWORD || 'root',
      password: process.env.MYSQL_ROOT_PASSWORD || 'root',
      database: process.env.MYSQL_DATABASE || 'nfc-tron',
      entities: [Customer],
      synchronize: false,
    }),
    DataModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
