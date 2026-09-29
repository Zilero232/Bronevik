import { Module } from '@nestjs/common';

import { UserLestaAccountsModule } from '../../core';
import { BillingCoreModule } from '../billing';
import { MarksModule } from '../marks';
import { UsageModule } from '../usage';
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
import { TankArmorController } from './tank-armor.controller';
import { TanksController } from './tanks.controller';
import { VehicleSourcesController } from './vehicle-sources.controller';
import { VehiclesController } from './vehicles.controller';

@Module({
  imports: [UserLestaAccountsModule, MarksModule, BillingCoreModule, UsageModule],
  controllers: [TanksController, TankArmorController, MyTanksController, VehiclesController, VehicleSourcesController],
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
