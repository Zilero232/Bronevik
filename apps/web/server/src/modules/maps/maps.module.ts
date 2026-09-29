import { Module } from '@nestjs/common';

import { MapsController } from './maps.controller';
import { MapsService, TankMapStatsService } from './services';
import { TankMapsController } from './tank-maps.controller';

@Module({
  controllers: [MapsController, TankMapsController],
  providers: [MapsService, TankMapStatsService]
})
export class MapsModule {}
