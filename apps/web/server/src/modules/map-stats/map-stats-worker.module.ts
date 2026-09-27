import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

import { MAP_STATS_QUEUE } from './config';
import { MapStatsProcessor, MapStatsSchedulesService } from './processors';
import { MapStatsAggregateService } from './services';

@Module({
  imports: [BullModule.registerQueue({ name: MAP_STATS_QUEUE.name })],
  providers: [MapStatsAggregateService, MapStatsProcessor, MapStatsSchedulesService]
})
export class MapStatsWorkerModule {}
