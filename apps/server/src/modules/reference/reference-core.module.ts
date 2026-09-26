import { Global, Module } from '@nestjs/common';

import { BronyaReferencesService, ExpectedValuesService, ThresholdsService, VehicleCatalogService } from './services';

/** The reference data other modules read — no controller, safe to load in the worker. */
@Global()
@Module({
  providers: [VehicleCatalogService, ExpectedValuesService, ThresholdsService, BronyaReferencesService],
  exports: [VehicleCatalogService, ExpectedValuesService, ThresholdsService, BronyaReferencesService]
})
export class ReferenceCoreModule {}
