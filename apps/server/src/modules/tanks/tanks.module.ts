import { Module } from '@nestjs/common';

import { AppConfigService, ARMOR_VIEWER } from '../../config';
import { createArmorStorage } from '../gamedata';
import { ARMOR_STORAGE } from './config';
import {
  TankArmorService,
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
  controllers: [TanksController, VehiclesController],
  providers: [
    armorStorageProvider,
    TankArmorService,
    TankStatsService,
    TierListService,
    TankDetailService,
    TopPlayersService,
    TankTrendService,
    TankPatchesService,
    VehicleListService
  ],
  exports: [TankDetailService, TankStatsService, TierListService]
})
export class TanksModule {}
