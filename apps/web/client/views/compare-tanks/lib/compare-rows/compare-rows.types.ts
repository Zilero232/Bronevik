import type { TankSpecGroup, TankSpecKey } from '@/entities/tank/tank';

export type CompareCell = {
  value: number | null;
  ratio: number | null;
  isBest: boolean;
  isWorst: boolean;
  delta: number | null;
  isLowerBetter: boolean;
};

export type CompareRowInput = {
  key: string;
  values: readonly (number | null)[];
};

export type RatioToBestInput = {
  value: number | null;
  reference: number | null;
  isLower: boolean;
};

export type SpecRow = {
  key: TankSpecKey;
  cells: CompareCell[];
};

export type SpecSection = {
  group: TankSpecGroup;
  rows: SpecRow[];
};

export type SpecSectionsInput = {
  specs: readonly Readonly<Record<string, number | null>>[];
};
