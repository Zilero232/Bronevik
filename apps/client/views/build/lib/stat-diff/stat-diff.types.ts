import type { SpecVerdict, TankSpecGroup, TankSpecKey, TankSpecs } from '@/entities/tank/tank';

export type BuildSide = 'a' | 'b';

export type StatRow = {
  key: TankSpecKey;
  base: number | null;
  a: number | null;
  b: number | null;
  delta: number | null;
  verdict: SpecVerdict;
  verdictB: SpecVerdict;
  diff: number | null;
  diffVerdict: SpecVerdict;
  winner: BuildSide | null;
  fill: number;
  fillB: number | null;
};

export type StatGroup = {
  group: TankSpecGroup;
  rows: StatRow[];
};

export type BuildStatGroupsInput = {
  base: TankSpecs;
  a: TankSpecs;
  b?: TankSpecs | null;
};

export type BarFillInput = {
  key: string;
  value: number | null;
  base: number | null;
};

export type MinusInput = {
  after: number | null;
  before: number | null;
};

export type WinnerInput = {
  key: string;
  a: number | null;
  b: number | null;
};

export type StatRowInput = {
  key: TankSpecKey;
  specs: BuildStatGroupsInput;
};

export type ReadSpecInput = {
  specs: TankSpecs | null | undefined;
  key: string;
};
