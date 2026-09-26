import { paymentStatusSchema, subscriptionStatusSchema } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import { paymentTone, subscriptionTone } from '../status-tone';

const HEALTHY = 'success';

describe('subscriptionTone', () => {
  it('gives every subscription status a tone', () => {
    subscriptionStatusSchema.options.forEach((status) => expect(subscriptionTone(status)).toEqual(expect.any(String)));
  });

  it('reads only an active subscription as healthy', () => {
    const healthy = subscriptionStatusSchema.options.filter((status) => subscriptionTone(status) === HEALTHY);

    expect(healthy).toEqual(['active']);
  });

  it('keeps a failed renewal apart from a lapsed subscription', () => {
    expect(subscriptionTone('pastDue')).not.toBe(subscriptionTone('expired'));
    expect(subscriptionTone('pastDue')).not.toBe(HEALTHY);
  });

  it('falls back to the neutral tone when there is no subscription', () => {
    expect(subscriptionTone(null)).toBe(subscriptionTone('canceled'));
  });
});

describe('paymentTone', () => {
  it('gives every payment status a tone', () => {
    paymentStatusSchema.options.forEach((status) => expect(paymentTone(status)).toEqual(expect.any(String)));
  });

  it('marks only a succeeded payment as healthy', () => {
    const healthy = paymentStatusSchema.options.filter((status) => paymentTone(status) === HEALTHY);

    expect(healthy).toEqual(['succeeded']);
  });

  it('shows both in-flight states the same way', () => {
    expect(paymentTone('pending')).toBe(paymentTone('waitingForCapture'));
  });
});
