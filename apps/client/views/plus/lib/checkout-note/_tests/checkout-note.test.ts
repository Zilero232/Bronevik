import { describe, expect, it } from 'vitest';

import { checkoutNote } from '../checkout-note';

describe('checkoutNote', () => {
  it('tells a subscriber how long the current state lasts', () => {
    expect(checkoutNote({ isPlus: true, state: 'trial', periodEnd: '2026-10-03T00:00:00.000Z', isCheckoutAvailable: false })).toEqual({
      kind: 'state',
      state: 'trial',
      periodEnd: '2026-10-03T00:00:00.000Z'
    });
  });

  it('explains that payments are not open yet while checkout is off', () => {
    expect(checkoutNote({ isPlus: false, state: 'none', periodEnd: null, isCheckoutAvailable: false })).toEqual({ kind: 'text', key: 'closedNote' });
  });

  it('shows the payment note once checkout is open', () => {
    expect(checkoutNote({ isPlus: false, state: 'expired', periodEnd: null, isCheckoutAvailable: true })).toEqual({ kind: 'text', key: 'note' });
  });
});
