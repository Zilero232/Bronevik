export { THRESHOLD_SOURCE_PRIORITY } from './config';
export {
  BRONYA_REFERENCE,
  bronyaReferencePayload,
  parseBronyaReference,
  readVehicleStats,
  toMasteryThreshold,
  toMoeThreshold,
  toVehicleStats
} from './lib';
export type { StoredProfile } from './lib';
export { ReferenceCoreModule } from './reference-core.module';
export { ReferenceModule } from './reference.module';
export type { CatalogEntry } from './reference.types';
export { BronyaReferencesService, ExpectedValuesService, ThresholdsService, VehicleCatalogService } from './services';
