import type { ThresholdDrop, ThresholdDropsInput } from './threshold-drops.types';

import { MARK_PERCENTILES } from './threshold-drops.constants';

export const thresholdDrops = ({ previous, current, minDropPercent }: ThresholdDropsInput): ThresholdDrop[] =>
  MARK_PERCENTILES.flatMap(({ mark, key }) => {
    const from = previous[key];
    const to = current[key];

    return from > 0 && to < from * (1 - minDropPercent / 100) ? [{ mark, from, to }] : [];
  });
