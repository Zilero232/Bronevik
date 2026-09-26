import { Module } from '@nestjs/common';

import { ReferenceProcessor } from './processors/reference.processor';
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
