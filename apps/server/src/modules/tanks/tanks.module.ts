import { Module } from '@nestjs/common';

import {
  TankDetailService,
  TankPatchesService,
  TankStatsService,
  TankTrendService,
  TierListService,
  TopPlayersService,
  VehicleListService
} from './services';
import { TanksController } from './tanks.controller';
import { VehiclesController } from './vehicles.controller';

@Module({
  controllers: [TanksController, VehiclesController],
  providers: [TankStatsService, TierListService, TankDetailService, TopPlayersService, TankTrendService, TankPatchesService, VehicleListService],
  exports: [TopPlayersService, TankDetailService, TankStatsService, TierListService]
})
export class TanksModule {}
