import { describe, expect, it } from 'vitest';

import { accountState } from '../account';

const status = { bound: false, auth_failed: false, account_id: null, text: '' };

describe(accountState, () => {
  it('tells a bound, an unbound and an expired binding apart', () => {
    expect(accountState({ ...status, bound: true }).title).toBe('accountBound');
    expect(accountState(status).title).toBe('accountUnbound');
    expect(accountState({ ...status, bound: true, auth_failed: true })).toMatchObject({ title: 'accountAuthFailed', tone: 'danger' });
  });
});
