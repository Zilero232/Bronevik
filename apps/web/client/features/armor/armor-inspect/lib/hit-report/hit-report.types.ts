import type { ArmorShell, ArmorTrace, ArmorTraceLayer } from '@otmetki/gamedata';

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

type HitPlateReport = Omit<HitLayer, 'angle' | 'distance'> & Pick<ArmorTraceLayer, 'angle' | 'effective' | 'overmatch' | 'ricochet'>;

export type HitReport = Pick<ArmorTrace, 'chance' | 'total' | 'verdict'> & {
  first: HitPlateReport;
  main: HitPlateReport | undefined;
  penetration: number;
  layerCount: number;
};
