import { Module } from '@nestjs/common';

import { QueueStatsService } from './services';

@Module({
  providers: [QueueStatsService]
})
export class MonitoringModule {}
