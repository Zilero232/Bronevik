export { THRESHOLD_SOURCE_PRIORITY } from './config';
export { BRONYA_REFERENCE, bronyaReferencePayload, parseBronyaReference } from './lib';
export { readVehicleStats, toMasteryThreshold, toMoeThreshold, toVehicleStats } from './mappers';
export type { StoredProfile } from './mappers';
export { ReferenceCoreModule } from './reference-core.module';
export { ReferenceModule } from './reference.module';
export type { CatalogEntry } from './reference.types';
export { BronyaReferencesService, ExpectedValuesService, ThresholdsService, VehicleCatalogService } from './services';
