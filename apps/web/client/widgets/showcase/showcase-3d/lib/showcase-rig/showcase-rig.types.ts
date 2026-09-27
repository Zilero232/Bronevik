import type { ArmorGeometry, ArmorPieceGeometry, Vec3 } from '@otmetki/gamedata';
import type { ArmorModulesData } from '@otmetki/schemas';

export type ShowcaseRigInput = {
  geometry: ArmorGeometry;
  modules: ArmorModulesData;
};

export type ShowcasePart = {
  piece: ArmorPieceGeometry;
  position: Vec3;
};

export type ShowcaseRig = {
  body: ShowcasePart[];
  turret: { position: Vec3; parts: ShowcasePart[] } | null;
  center: Vec3;
  radius: number;
  floor: number;
  height: number;
};
