import { Global, Module } from '@nestjs/common';

import { ReferenceController } from './reference.controller';
import {
  BronyaReferencesService,
  ExpectedValuesService,
  GameVersionService,
  ServersOnlineService,
  ThresholdsService,
  VehicleCatalogService
} from './services';

@Global()
@Module({
  controllers: [ReferenceController],
  providers: [VehicleCatalogService, ExpectedValuesService, ThresholdsService, BronyaReferencesService, GameVersionService, ServersOnlineService],
  exports: [VehicleCatalogService, ExpectedValuesService, ThresholdsService, BronyaReferencesService]
})
export class ReferenceModule {}
