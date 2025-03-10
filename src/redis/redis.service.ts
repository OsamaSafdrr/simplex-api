import { Injectable } from '@nestjs/common';
import { createClient } from 'redis';

@Injectable()
export class RedisService {
  private client;

  constructor() {
    this.client = createClient({ url: 'redis://redis:6379' });
    this.client.connect();
    this.client.on('error', (err) => console.error('Redis Error:', err));
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: any, ttl: number = 3600): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }
}
