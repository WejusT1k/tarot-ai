import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './database/data-source';
import { AuthModule } from './modules/auth/auth.module';
import { CardsModule } from './modules/cards/cards.module';
import { ReadingsModule } from './modules/readings/readings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot(dataSourceOptions),
    AuthModule,
    CardsModule,
    ReadingsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
