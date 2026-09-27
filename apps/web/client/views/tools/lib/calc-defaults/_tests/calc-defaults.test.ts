import { describe, expect, it } from 'vitest';

import { ECONOMY_TIERS, TARGET, TARGET_METRICS } from '../../../config';
import { shellPriceValues, targetDefaults } from '../calc-defaults';

describe('shellPriceValues', () => {
  it('takes the shell prices of the given tier', () => {
    const { ap, heat, he } = ECONOMY_TIERS[5];

    expect(shellPriceValues(5)).toEqual({ apPrice: ap, heatPrice: heat, hePrice: he });
  });

  it('falls back to the top tier for an unknown tier', () => {
    expect(shellPriceValues(99)).toEqual(shellPriceValues(10));
  });
});

describe('targetDefaults', () => {
  it.each(TARGET_METRICS)('starts %s from its own defaults and the shared battle count', (metric) => {
    expect(targetDefaults(metric)).toEqual({ metric, battles: TARGET.defaults.battles, ...TARGET.metrics[metric].defaults });
  });
});
