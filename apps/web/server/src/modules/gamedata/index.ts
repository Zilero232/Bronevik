export { ArmorVersionMismatchError, collectArmorModels, createArmorStorage, purgeArmorModels, writeArmorModels } from './lib/armor';
export type { ArmorStorage, CollectedArmorModels } from './lib/armor';
export { buildGameData } from './lib/game-data';
export { isNation } from './lib/ids';
export { createImportPlan, importLocalizationKeys, writeImportPlan } from './lib/importer';
export { loadLocalization } from './lib/localization';
export { resolveVehicleProgression } from './lib/parsers/post-progression';
export { buildPersonalMissions, writePersonalMissions } from './lib/personal-missions';
export type { PersonalMissionCounts } from './lib/personal-missions';
export type { RepoReader } from './lib/source';
export {
  compareEncyclopediaVersion,
  createGithubReader,
  createLocalReader,
  createLocalRepoReader,
  createRepoReader,
  GAME_DATA_SOURCES,
  LOCALE_SOURCES,
  MODEL_SOURCES,
  MT_CLIENT,
  vehicleRenderUrl
} from './lib/source';
