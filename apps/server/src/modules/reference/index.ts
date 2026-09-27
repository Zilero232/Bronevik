export { THRESHOLD_SOURCE_PRIORITY } from './config';
export { BRONYA_REFERENCE, bronyaReferencePayload, parseBronyaReference } from './lib';
export {
  masteryThresholdLevels,
  moeThresholdLevels,
  readVehicleStats,
  toMasteryThreshold,
  toMasteryThresholdRecord,
  toMoeThreshold,
  toMoeThresholdRecord,
  toVehicleStats
} from './mappers';
export type { StoredProfile } from './mappers';
export { ReferenceCoreModule } from './reference-core.module';
export { ReferenceModule } from './reference.module';
export type { CatalogEntry, MasteryLevels, MasteryThresholdRecord, MoeLevels, MoeThresholdRecord, ThresholdSet } from './reference.types';
export { BronyaReferencesService, ExpectedValuesService, ThresholdsService, VehicleCatalogService } from './services';
