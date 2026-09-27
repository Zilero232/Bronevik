import { Module } from '@nestjs/common';

import { MapStatsController } from './map-stats.controller';
import { MapStatsService } from './services';

@Module({
  controllers: [MapStatsController],
  providers: [MapStatsService]
})
export class MapStatsModule {}
