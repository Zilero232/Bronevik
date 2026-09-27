import { Module } from '@nestjs/common';

import { HttpModule } from '../../../core';
import { ReferenceProcessor } from './processors';
import {
  CatalogSyncService,
  EncyclopediaSyncService,
  EquipmentSyncService,
  ExpectedValuesSyncService,
  MasteryThresholdsSyncService,
  MoeThresholdsSyncService,
  VehicleSyncService
} from './services';

@Module({
  imports: [HttpModule],
  providers: [
    EncyclopediaSyncService,
    VehicleSyncService,
    EquipmentSyncService,
    CatalogSyncService,
    ExpectedValuesSyncService,
    MoeThresholdsSyncService,
    MasteryThresholdsSyncService,
    ReferenceProcessor
  ]
})
export class ReferenceModule {}
