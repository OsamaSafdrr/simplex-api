
import { Controller, Get, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Product } from '../products/entities/product.entity';
import { Order } from '../orders/entities/order.entity';
import { performance } from 'perf_hooks';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  @Get('top-products')
  @ApiOperation({ summary: 'Get top-selling products' })
  async getTopSellingProducts() {
    const cacheKey = 'top-selling-products';
    console.log(`[CACHE] Checking for key: ${cacheKey}`);
  
    try {
      const cachedData = await this.cacheManager.get(cacheKey);
      if (cachedData) {
        console.log(`[CACHE] Cache HIT! Returning cached data`);
        return cachedData;
      }
  
      console.log(`[CACHE] Cache MISS! Querying database...`);
  
      const start = performance.now();
      const topProducts = await this.orderRepository
        .createQueryBuilder('order')
        .select([
          'order.productId AS productId',
          'SUM(order.quantity) AS totalSales',
          'product.name AS productName',
        ])
        .leftJoin(Product, 'product', 'product.id = order.productId')
        .groupBy('order.productId, product.name')
        .orderBy('totalSales', 'DESC')
        .limit(10)
        .getRawMany();
      const end = performance.now();
  
      console.log(`[DB] Query executed in ${(end - start).toFixed(2)} ms`);
      console.log(`[DB] Fetched Data:`, topProducts);
  
      const result = topProducts.map((p) => ({
        id: p.productId,
        name: p.productName || 'Unknown Product',
        totalSales: p.totalSales,
      }));
  
      console.log(`[CACHE] Setting cache for key: ${cacheKey}`);
      await this.cacheManager.set(cacheKey, result, 60);
      
      const testCache = await this.cacheManager.get(cacheKey);
      if (testCache) {
        console.log(`[CACHE] Successfully cached data!`);
      } else {
        console.log(`[CACHE] Cache set failed!`);
      }
  
      return result;
    } catch (error) {
      console.error(`[ERROR] Something went wrong:`, error);
      throw error;
    }
  }
}  