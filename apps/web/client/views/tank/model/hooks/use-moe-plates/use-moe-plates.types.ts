import type { MarkCount } from '@otmetki/icons';

import type { SpecVerdict } from '@/entities/tank/tank';

import type { MoeKey } from '../../../lib';

type MoePlateDelta = {
  days: number;
  value: number | null;
  verdict: SpecVerdict;
};

export type MoePlate = {
  key: MoeKey;
  percent: number;
  marks: MarkCount;
  value: number | null;
  deltas: MoePlateDelta[];
};
