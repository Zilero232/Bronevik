import { Module } from '@nestjs/common';

import { AppConfigService, ARMOR_VIEWER } from '../../config';
import { BillingCoreModule } from '../billing';
import { createArmorStorage } from '../gamedata';
import { MarksModule } from '../marks';
import { ARMOR_STORAGE } from './config';
import { MyTanksController } from './my-tanks.controller';
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

const armorStorageProvider = {
  provide: ARMOR_STORAGE,
  inject: [AppConfigService],
  useFactory: (config: AppConfigService) =>
    createArmorStorage({
      REPLAY_STORAGE: config.get('REPLAY_STORAGE'),
      ARMOR_STORAGE_DIR: ARMOR_VIEWER.storageDir,
      S3_ENDPOINT: config.get('S3_ENDPOINT'),
      S3_REGION: config.get('S3_REGION'),
      S3_BUCKET: config.get('S3_BUCKET'),
      S3_ACCESS_KEY_ID: config.get('S3_ACCESS_KEY_ID'),
      S3_SECRET_ACCESS_KEY: config.get('S3_SECRET_ACCESS_KEY')
    })
};

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
