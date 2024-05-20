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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'nfc-tron',
      entities: [Customer],
      synchronize: false,
    }),
    DataModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
