import type { ArmorPieceKind } from '@bronevik/gamedata';
import type { ArmorPlateData } from '@bronevik/schemas';

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
