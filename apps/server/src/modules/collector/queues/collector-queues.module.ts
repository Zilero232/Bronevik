import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

import { QUEUE } from '../contracts';
import { QueueRegistryService } from './queue-registry.service';

const queues = BullModule.registerQueue(...Object.values(QUEUE).map((name) => ({ name })));

@Global()
@Module({
  imports: [queues],
  providers: [QueueRegistryService],
  exports: [queues, QueueRegistryService]
})
export class CollectorQueuesModule {}
