export { THRESHOLD_SOURCE_PRIORITY, VEHICLE_STATUS } from './config';
export { BRONYA_REFERENCE, bronyaReferencePayload, isPreferentialVehicle, parseBronyaReference, readSpecTraits, toTankRole } from './lib';
export type { SpecTraits } from './lib';
export {
  masteryThresholdLevels,
  moeThresholdLevels,
  readVehicleStats,
  toMasteryThreshold,
  toMoeThreshold,
  toMoeThresholdRecord,
  toVehicleStats
} from './mappers';
export type { StoredProfile } from './mappers';
export { ReferenceCoreModule } from './reference-core.module';
export { ReferenceModule } from './reference.module';
export type { CatalogEntry, MasteryLevels, MasteryThresholdRecord, MoeLevels, MoeThresholdRecord, ThresholdSet } from './reference.types';
export { BronyaReferencesService, ExpectedValuesService, OfficialRatingTypesService, ThresholdsService, VehicleCatalogService } from './services';
