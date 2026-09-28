import { describe, expect, it } from 'vitest';

import { PlusRequiredError } from '@/shared/api/source';
import { QUERY_KEYS } from '@/shared/constants';

import { competitionMutationMeta } from '..';

describe('competitionMutationMeta', () => {
  it('toasts the given key and refreshes the competition lists', () => {
    const meta = competitionMutationMeta('competitions.toast.joined');

    expect(meta.successKey).toBe('competitions.toast.joined');
    expect(meta.invalidates).toEqual([QUERY_KEYS.competitions.list({})]);
  });

  it('reports a Plus-only competition separately from community errors', () => {
    const { errorKey } = competitionMutationMeta('competitions.toast.left');

    expect(typeof errorKey === 'function' && errorKey(new PlusRequiredError({ code: 'PLAN_LIMIT_REACHED', details: {}, message: 'plus' }))).toBe(
      'competitions.errors.plus'
    );

    expect(typeof errorKey === 'function' && errorKey(new Error('boom'))).toBe('competitions.errors.unknown');
  });
});
