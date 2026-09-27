import { describe, expect, it } from 'vitest';

import { checkoutIdempotenceKey, describeCard, toAmount } from '../yookassa';
import { yookassaWebhookSchema } from '../yookassa.schemas';

describe('describeCard', () => {
  it('shows the card type and last digits', () => {
    expect(describeCard({ id: 'm', card: { last4: '4242', card_type: 'Visa' } })).toBe('Visa •••• 4242');
  });

  it('falls back to the method title, then to nothing', () => {
    expect(describeCard({ id: 'm', title: 'SberPay' })).toBe('SberPay');
    expect(describeCard(undefined)).toBeNull();
  });
});

describe('toAmount', () => {
  it('always sends two decimals as a string', () => {
    expect(toAmount(199)).toEqual({ value: '199.00', currency: 'RUB' });
  });
});

describe('yookassaWebhookSchema', () => {
  it('accepts a payment notification and keeps unknown fields', () => {
    const parsed = yookassaWebhookSchema.parse({ type: 'notification', event: 'payment.succeeded', object: { id: 'p1', status: 'succeeded' } });

    expect(parsed.object.id).toBe('p1');
  });

  it('rejects a body that is not a notification', () => {
    expect(yookassaWebhookSchema.safeParse({ event: 'payment.succeeded', object: { id: 'p1' } }).success).toBe(false);
  });
});

describe('checkoutIdempotenceKey', () => {
  const base = { userId: 'u1', plan: 'monthly', promoCode: undefined, now: new Date('2026-09-25T12:00:05Z') } as const;

  it('repeats within the same minute and fits the YooKassa 64-character limit', () => {
    const key = checkoutIdempotenceKey(base);

    expect(checkoutIdempotenceKey({ ...base, now: new Date('2026-09-25T12:00:59Z') })).toBe(key);
    expect(key).toHaveLength(64);
  });

  it('changes with the minute, the plan and the promo code', () => {
    const key = checkoutIdempotenceKey(base);

    expect(checkoutIdempotenceKey({ ...base, now: new Date('2026-09-25T12:01:00Z') })).not.toBe(key);
    expect(checkoutIdempotenceKey({ ...base, plan: 'yearly' })).not.toBe(key);
    expect(checkoutIdempotenceKey({ ...base, promoCode: 'SPRING' })).not.toBe(key);
  });
});
