import { describe, expect, it } from 'vitest';

import { PlusRequiredError } from '@/shared/api/source';

import { followErrorKey } from '../follow-error';

describe('followErrorKey', () => {
  it('tells the free follow limit apart from a Plus-only feature', () => {
    expect(followErrorKey(new PlusRequiredError({ code: 'PLAN_LIMIT_REACHED', details: {}, message: 'limit' }))).toBe('limit');
    expect(followErrorKey(new PlusRequiredError({ code: 'SUBSCRIPTION_REQUIRED', details: {}, message: 'plus' }))).toBe('plusRequired');
  });

  it('falls back to a generic failure for anything else', () => {
    expect(followErrorKey(new Error('network'))).toBe('failed');
  });
});
