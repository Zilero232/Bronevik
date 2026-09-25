import { Global, Module } from '@nestjs/common';

import { BronyaReferencesService, ExpectedValuesService, ThresholdsService, VehicleCatalogService } from './services';

@Global()
@Module({
  providers: [VehicleCatalogService, ExpectedValuesService, ThresholdsService, BronyaReferencesService],
  exports: [VehicleCatalogService, ExpectedValuesService, ThresholdsService, BronyaReferencesService]
})
export class ReferenceModule {}
