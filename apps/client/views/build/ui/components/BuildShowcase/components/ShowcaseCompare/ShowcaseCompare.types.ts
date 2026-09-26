import type { DeltaVerdict } from '@/shared/lib';

import type { BuildShowcaseSource } from '../../../../../model/hooks';

export type ShowcaseCompareItem = {
  id: 'avgDamage' | 'winRate';
  value: number | null;
  delta: number | null;
  verdict: DeltaVerdict | null;
  isPercent: boolean;
};

export type ShowcaseCompareProps = {
  items: readonly ShowcaseCompareItem[];
  other: BuildShowcaseSource;
};
