
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { redisStore } from 'cache-manager-redis-store';
import { Product } from './products/entities/product.entity';
import { Order } from './orders/entities/order.entity';
import { AnalyticsModule } from './analytics/analytics.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST || 'mysql',
      port: parseInt(process.env.DB_PORT || '3306', 10),
      username: process.env.DB_USER || 'nest',
      password: process.env.DB_PASSWORD || 'nest',
      database: process.env.DB_NAME || 'nest_perf',
      entities: [Product, Order],
      synchronize: true,
      logging: true,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: await redisStore({
          socket: { 
            host: process.env.REDIS_HOST || 'simplex-redis',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
          },
          ttl: 60,
        }),
      }),
    }),
    AnalyticsModule,
    ProductsModule,
    OrdersModule,
  ],
})
export class AppModule {
  static setupSwagger(app) {
    const config = new DocumentBuilder()
      .setTitle('Simplex API')
      .setDescription('API documentation for Simplex API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }
}
