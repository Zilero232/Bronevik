import type { ArmorPieceKind } from '@otmetki/gamedata';
import type { ArmorPlateData } from '@otmetki/schemas';

export type RayHit = {
  distance: number;
  piece: string;
  kind: ArmorPieceKind;
  plate: ArmorPlateData | undefined;
  cosine: number;
};

export type ToHitLayersInput = {
  hits: readonly RayHit[];
  hideSpaced: boolean;
};
