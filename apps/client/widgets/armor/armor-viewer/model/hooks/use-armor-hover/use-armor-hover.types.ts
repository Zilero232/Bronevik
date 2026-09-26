import type { ArmorPieceKind } from '@bronevik/gamedata';

import type { ArmorShellState } from '@/entities/armor/armor-model';
import type { HitReport } from '@/features/armor/armor-inspect';

import type { RayHit } from '../../../lib/ray-layers';

export type UseArmorHoverInput = {
  shellState: ArmorShellState;
  hideSpaced: boolean;
};

export type ArmorHoverEvent = {
  hits: RayHit[];
  x: number;
  y: number;
  width: number;
};

export type ArmorHover = {
  report: HitReport;
  kind: ArmorPieceKind;
  x: number;
  y: number;
  flip: boolean;
};
