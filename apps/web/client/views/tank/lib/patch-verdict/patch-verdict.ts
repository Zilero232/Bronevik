import type { TankPatch, TankPatchChange } from '@otmetki/schemas';

import { isNumber } from 'remeda';

import type { SpecVerdict } from '@/entities/tank/tank';

import { specKeyOfPath } from '@/entities/tank/tank';

import type { PatchChangeRow, PatchEntry } from './patch-verdict.types';

const EFFECT_VERDICT: Record<TankPatchChange['effect'], SpecVerdict> = { better: 'better', worse: 'worse', neutral: 'same' };

export const patchChangeRow = ({ key, before, after, effect }: TankPatchChange): PatchChangeRow => ({
  key,
  specKey: specKeyOfPath(key),
  before,
  after,
  delta: isNumber(before) && isNumber(after) ? after - before : null,
  verdict: EFFECT_VERDICT[effect]
});

export const patchEntries = (patches: readonly TankPatch[]): PatchEntry[] =>
  [...patches]
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))
    .map(({ version, title, date, verdict, changes }) => ({ version, title, date, verdict, changes: changes.map(patchChangeRow) }));
