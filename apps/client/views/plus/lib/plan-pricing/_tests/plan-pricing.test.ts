import type { Plans } from '@bronevik/schemas';

import { describe, expect, it } from 'vitest';

import { planPricing } from '../plan-pricing';

const MONTHLY = { plan: 'monthly', months: 1, priceRub: 199 } as const;

const YEARLY = { plan: 'yearly', months: 12, priceRub: 1_790 } as const;

const OFFERS: Plans = [MONTHLY, YEARLY];

describe('planPricing', () => {
  it('returns nothing when there are no offers', () => {
    expect(planPricing([])).toEqual([]);
  });

  it('divides every price by its months to get the per-month price', () => {
    planPricing(OFFERS).forEach(({ priceRub, months, perMonthRub }) => {
      expect(perMonthRub * months).toBeCloseTo(priceRub, 1);
    });
  });

  it('never shows a saving on the shortest plan, which is the baseline', () => {
    const [monthly] = planPricing(OFFERS);

    expect(monthly.savingRub).toBe(0);
    expect(monthly.savingPercent).toBe(0);
  });

  it('counts the yearly saving against paying month by month', () => {
    const [, yearly] = planPricing(OFFERS);

    expect(yearly.savingRub).toBe(MONTHLY.priceRub * YEARLY.months - YEARLY.priceRub);
    expect(yearly.savingPercent).toBe(Math.round((yearly.savingRub / (MONTHLY.priceRub * YEARLY.months)) * 100));
  });

  it('picks the baseline by months, not by the order of the offers', () => {
    const [yearly] = planPricing([YEARLY, MONTHLY]);

    expect(yearly.savingRub).toBeGreaterThan(0);
  });

  it('never reports a negative saving when a longer plan costs more per month', () => {
    const [, pricey] = planPricing([MONTHLY, { ...YEARLY, priceRub: MONTHLY.priceRub * YEARLY.months * 2 }]);

    expect(pricey.savingRub).toBe(0);
    expect(pricey.savingPercent).toBe(0);
  });
});
