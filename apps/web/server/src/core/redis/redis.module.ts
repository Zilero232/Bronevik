import type { OnApplicationShutdown } from '@nestjs/common';

import { Global, Inject, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { AppConfigService } from '../../config';
import { REDIS, REDIS_OPTIONS } from './redis.constants';

@Global()
@Module({
  providers: [
    {
      provide: REDIS,
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) =>
        new Redis(config.get('REDIS_URL'), {
          maxRetriesPerRequest: REDIS_OPTIONS.maxRetriesPerRequest,
          connectTimeout: REDIS_OPTIONS.connectTimeoutMs,
          commandTimeout: REDIS_OPTIONS.commandTimeoutMs
        })
    }
  ],
  exports: [REDIS]
})
export class RedisModule implements OnApplicationShutdown {
  constructor(@Inject(REDIS) private readonly redis: Redis) {}

  async onApplicationShutdown() {
    await this.redis.quit().catch(() => undefined);
  }
}
