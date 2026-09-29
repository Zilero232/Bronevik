import type { ArmorModules } from '@otmetki/gamedata';

import type { GameData } from '../../game-data';
import type { RepoReader } from '../../source';

export type CollectArmorModelsInput = {
  data: GameData;
  reader: RepoReader;
  onProgress?: (message: string) => void;
};

type ArmorModelBuild = {
  tankId: number;
  tag: string;
  bytes: Uint8Array;
  hash: string;
  modules: ArmorModules;
};

type SkippedArmorModel = {
  tag: string;
  reason: string;
};

export type CollectedArmorModels = {
  version: string;
  sourceSha: string;
  models: ArmorModelBuild[];
  skipped: SkippedArmorModel[];
  mismatches: string[];
};

export type VehicleOutcome = {
  model?: ArmorModelBuild;
  skipped?: SkippedArmorModel;
  mismatches: string[];
};
