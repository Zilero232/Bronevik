import { Global, Module } from '@nestjs/common';

import { collectorQueues } from './providers';
import { QueueRegistryService } from './queue-registry.service';

@Global()
@Module({
  imports: [collectorQueues],
  providers: [QueueRegistryService],
  exports: [collectorQueues, QueueRegistryService]
})
export class CollectorQueuesModule {}
