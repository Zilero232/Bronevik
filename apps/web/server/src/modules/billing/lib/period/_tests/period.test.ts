import { addDays, addMonths } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { cancelsAtPeriodEnd, extendPeriod, isPeriodActive, renewalIdempotenceKey, revokePeriod } from '../period';

const now = new Date('2026-09-25T12:00:00Z');

describe('extendPeriod', () => {
  it('extends a running period from its end, not from now', () => {
    const currentPeriodEnd = addDays(now, 10);

    expect(extendPeriod({ currentPeriodEnd, now, months: 1 })).toEqual(addMonths(currentPeriodEnd, 1));
  });

  it('starts a lapsed period from now', () => {
    expect(extendPeriod({ currentPeriodEnd: addDays(now, -3), now, days: 7 })).toEqual(addDays(now, 7));
  });

  it('starts a first period from now', () => {
    expect(extendPeriod({ currentPeriodEnd: null, now, months: 12 })).toEqual(addMonths(now, 12));
  });
});

describe('isPeriodActive', () => {
  it('is false exactly at the end of the period', () => {
    expect(isPeriodActive({ currentPeriodEnd: now, now })).toBe(false);
    expect(isPeriodActive({ currentPeriodEnd: null, now })).toBe(false);
  });
});

describe('cancelsAtPeriodEnd', () => {
  it('renews only with recurring on, a saved card and no cancellation', () => {
    expect(cancelsAtPeriodEnd({ isRecurringEnabled: true, hasMethod: true, wasCancelled: false })).toBe(false);
    expect(cancelsAtPeriodEnd({ isRecurringEnabled: false, hasMethod: true, wasCancelled: false })).toBe(true);
    expect(cancelsAtPeriodEnd({ isRecurringEnabled: true, hasMethod: false, wasCancelled: false })).toBe(true);
    expect(cancelsAtPeriodEnd({ isRecurringEnabled: true, hasMethod: true, wasCancelled: true })).toBe(true);
  });
});

describe('renewalIdempotenceKey', () => {
  it('is the same for the same period and different for the next one', () => {
    const key = renewalIdempotenceKey({ subscriptionId: 's', currentPeriodEnd: now });

    expect(renewalIdempotenceKey({ subscriptionId: 's', currentPeriodEnd: new Date(now) })).toBe(key);
    expect(renewalIdempotenceKey({ subscriptionId: 's', currentPeriodEnd: addMonths(now, 1) })).not.toBe(key);
  });
});

describe('revokePeriod', () => {
  it('takes the refunded months back off a longer period', () => {
    const currentPeriodEnd = addMonths(now, 3);

    expect(revokePeriod({ currentPeriodEnd, now, months: 1 })).toEqual({ currentPeriodEnd: addMonths(currentPeriodEnd, -1), isExpired: false });
  });

  it('expires a period that the refund consumes entirely', () => {
    expect(revokePeriod({ currentPeriodEnd: addDays(now, 20), now, months: 1 }).isExpired).toBe(true);
  });
});
