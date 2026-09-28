import { Global, Module } from '@nestjs/common';

import { BronyaReferencesService, ExpectedValuesService, OfficialRatingTypesService, ThresholdsService, VehicleCatalogService } from './services';

@Global()
@Module({
  providers: [VehicleCatalogService, ExpectedValuesService, ThresholdsService, BronyaReferencesService, OfficialRatingTypesService],
  exports: [VehicleCatalogService, ExpectedValuesService, ThresholdsService, BronyaReferencesService, OfficialRatingTypesService]
})
export class ReferenceCoreModule {}
