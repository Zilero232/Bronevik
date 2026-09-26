import type { TankPatchChange, TankPatchVerdict } from '@otmetki/schemas';

import type { SpecVerdict, TankSpecKey } from '@/entities/tank/tank';

export type PatchChangeRow = {
  key: string;
  specKey: TankSpecKey | undefined;
  before: TankPatchChange['before'];
  after: TankPatchChange['after'];
  delta: number | null;
  verdict: SpecVerdict;
};

export type PatchEntry = {
  version: string;
  title: string | null;
  date: string | null;
  verdict: TankPatchVerdict;
  changes: PatchChangeRow[];
};
