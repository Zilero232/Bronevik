import type { Vec3 } from '@otmetki/gamedata';

import type { ArmorShellState } from '@/entities/armor/armor-model';
import type { HitReport } from '@/features/armor/armor-inspect';

import type { ARMOR_ZONES } from '../../config';
import type { RayHit } from '../ray-layers';
import type { ScenePart } from '../scene-parts';

type ZoneLayer = (typeof ARMOR_ZONES.layers)[number];

type ZoneSide = keyof typeof ARMOR_ZONES.sides;

export type ZoneHits = {
  layer: ZoneLayer;
  side: ZoneSide;
  hits: RayHit[];
};

export type ZoneHitsInput = {
  parts: readonly ScenePart[];
};

export type CastRayInput = ZoneHitsInput & {
  origin: Vec3;
  direction: Vec3;
};

export type ZoneReportsInput = ArmorShellState & {
  zones: readonly ZoneHits[];
  hideSpaced: boolean;
};

export type ZoneReport = {
  layer: ZoneLayer;
  side: ZoneSide;
  report: HitReport | null;
};
