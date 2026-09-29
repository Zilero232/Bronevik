import type { ArmorShell, ArmorVerdict } from '@otmetki/gamedata';

export type HitLayer = {
  piece: string;
  plate: string;
  thickness: number;
  flags: number;
  angle: number;
  distance: number;
};

export type DescribeHitInput = {
  layers: readonly HitLayer[];
  shell: ArmorShell;
  randomness: number;
};

export type HitPlateReport = {
  piece: string;
  plate: string;
  thickness: number;
  flags: number;
  angle: number;
  effective: number;
  overmatch: boolean;
  ricochet: boolean;
};

export type HitReport = {
  first: HitPlateReport;
  main: HitPlateReport | undefined;
  total: number;
  penetration: number;
  chance: number;
  layerCount: number;
  verdict: ArmorVerdict;
};
