import { billingStatusSchema, checkoutResultSchema, paymentHistorySchema, plansSchema, plusPlanSchema } from '@bronevik/schemas';
import { describe, expect, it } from 'vitest';

import { mockBilling } from '../mock/billing.mock';
import { BILLING_MOCK } from '../mock/billing.mock.constants';

describe('mockBilling', () => {
  it('offers every Plus plan and matches the shared contract', () => {
    const plans = plansSchema.parse(mockBilling.plans());

    expect(plans.map(({ plan }) => plan).sort()).toEqual([...plusPlanSchema.options].sort());
    expect(() => billingStatusSchema.parse(mockBilling.status())).not.toThrow();
    expect(() => paymentHistorySchema.parse(mockBilling.history())).not.toThrow();
  });

  it('returns an absolute confirmation URL from checkout', () => {
    expect(() => checkoutResultSchema.parse(mockBilling.checkout({ plan: 'yearly' }))).not.toThrow();
  });

  it('toggles auto-renew both ways', () => {
    expect(mockBilling.setAutoRenew(false).cancelAtPeriodEnd).toBe(true);
    expect(mockBilling.setAutoRenew(true).cancelAtPeriodEnd).toBe(false);
  });

  it('extends the period for the free-days code and rejects an unknown one', () => {
    const before = new Date(mockBilling.status().currentPeriodEnd ?? 0).getTime();
    const after = new Date(mockBilling.redeemPromo({ code: BILLING_MOCK.freeDaysCode }).currentPeriodEnd ?? 0).getTime();

    expect(after).toBeGreaterThan(before);
    expect(() => mockBilling.redeemPromo({ code: `${BILLING_MOCK.freeDaysCode}X` })).toThrow();
  });
});
