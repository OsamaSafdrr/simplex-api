import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnalyticsController } from './analytics.controller';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Order])],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
