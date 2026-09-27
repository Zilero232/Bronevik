import { Module } from '@nestjs/common';

import { BillingCoreModule } from '../billing';
import { MarksModule } from '../marks';
import { MyTanksController } from './my-tanks.controller';
import { armorStorageProvider } from './providers';
import {
  MyTankInsightsService,
  TankArmorService,
  TankDetailService,
  TankDifficultyService,
  TankEconomyReportService,
  TankLearningService,
  TankObtainService,
  TankPatchesService,
  TankStatsService,
  TankTraitsService,
  TankTrendService,
  TierListService,
  TopPlayersService,
  VehicleListService,
  VehicleSourcesService
} from './services';
import { TanksController } from './tanks.controller';
import { VehicleSourcesController } from './vehicle-sources.controller';
import { VehiclesController } from './vehicles.controller';

@Module({
  imports: [MarksModule, BillingCoreModule],
  controllers: [TanksController, MyTanksController, VehiclesController, VehicleSourcesController],
  providers: [
    armorStorageProvider,
    TankArmorService,
    TankStatsService,
    TierListService,
    TankDetailService,
    TankDifficultyService,
    TopPlayersService,
    TankTrendService,
    TankPatchesService,
    VehicleListService,
    TankTraitsService,
    TankObtainService,
    TankEconomyReportService,
    TankLearningService,
    MyTankInsightsService,
    VehicleSourcesService
  ],
  exports: [TankDetailService, TankDifficultyService, TankStatsService, TierListService]
})
export class TanksModule {}
