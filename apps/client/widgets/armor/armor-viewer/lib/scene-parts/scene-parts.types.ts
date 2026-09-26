import type { ArmorGeometry, ArmorPieceGeometry, Vec3 } from '@otmetki/gamedata';
import type { ArmorGunModuleData, ArmorModulesData, ArmorPlateData, ArmorTurretModuleData } from '@otmetki/schemas';

import type { ArmorLayerKey } from '@/features/armor/armor-inspect';

export type ScenePartsInput = {
  geometry: ArmorGeometry;
  modules: ArmorModulesData;
  turret: ArmorTurretModuleData | undefined;
  gun: ArmorGunModuleData | undefined;
  layers: readonly ArmorLayerKey[];
};

export type ScenePart = {
  layer: Exclude<ArmorLayerKey, 'spaced'>;
  piece: ArmorPieceGeometry;
  plates: readonly ArmorPlateData[];
  position: Vec3;
};

export type ModelBounds = {
  center: Vec3;
  radius: number;
};
