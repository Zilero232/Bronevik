import { Module } from '@nestjs/common';

import { HttpModule } from '../../../core';
import { ReferenceProcessor } from './processors';
import {
  CatalogSyncService,
  EncyclopediaSyncService,
  EquipmentSyncService,
  ExpectedValuesSyncService,
  MasteryThresholdsSyncService,
  MoeEstimateSyncService,
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
    MoeEstimateSyncService,
    MasteryThresholdsSyncService,
    ReferenceProcessor
  ]
})
export class ReferenceModule {}
