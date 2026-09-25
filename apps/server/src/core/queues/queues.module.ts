import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';
import { Redis } from 'ioredis';

import { AppConfigService } from '../../config';
import { QUEUE_DEFAULTS } from './queues.config';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        prefix: QUEUE_DEFAULTS.prefix,
        connection: new Redis(config.get('REDIS_URL'), { maxRetriesPerRequest: null }),
        defaultJobOptions: QUEUE_DEFAULTS.jobOptions
      })
    })
  ]
})
export class QueuesModule {}
