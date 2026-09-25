import { Module } from '@nestjs/common';

import { QueueStatsService } from './services/queue-stats.service';

@Module({
  providers: [QueueStatsService]
})
export class MonitoringModule {}
