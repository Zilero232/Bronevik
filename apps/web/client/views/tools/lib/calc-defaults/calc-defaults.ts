import type { TargetMetric } from '../../config';
import type { ShellPriceValues, TargetValues } from './calc-defaults.types';

import { TARGET } from '../../config';
import { defaultShellPrices } from '../battle-economy';

export const shellPriceValues = (tier: number): ShellPriceValues => {
  const { ap, heat, he } = defaultShellPrices(tier);

  return { apPrice: ap, heatPrice: heat, hePrice: he };
};

export const targetDefaults = (metric: TargetMetric): TargetValues => ({
  metric,
  battles: TARGET.defaults.battles,
  ...TARGET.metrics[metric].defaults
});
