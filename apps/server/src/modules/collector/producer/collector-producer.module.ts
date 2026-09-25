import { Global, Module } from '@nestjs/common';

import { CollectorProducerService } from './collector-producer.service';

@Global()
@Module({
  providers: [CollectorProducerService],
  exports: [CollectorProducerService]
})
export class CollectorProducerModule {}
