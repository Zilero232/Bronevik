import type { ArmorModules } from '@bronevik/gamedata';

import type { GameData } from '../../game-data';
import type { RepoReader } from '../../source';

export type CollectArmorModelsInput = {
  data: GameData;
  reader: RepoReader;
  onProgress?: (message: string) => void;
};

export type ArmorModelBuild = {
  tankId: number;
  tag: string;
  bytes: Uint8Array;
  hash: string;
  modules: ArmorModules;
};

export type CollectedArmorModels = {
  version: string;
  sourceSha: string;
  models: ArmorModelBuild[];
  skipped: string[];
  mismatches: string[];
};

export type VehicleOutcome = {
  model?: ArmorModelBuild;
  skipped?: string;
  mismatches: string[];
};
