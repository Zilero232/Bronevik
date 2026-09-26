import { describe, expect, it } from 'vitest';

import { COMMUNITY_ACCOUNT } from '../../../config';
import { chosenAccountId } from '../account-choice';

describe('chosenAccountId', () => {
  it('leaves the account to the server for the primary choice', () => {
    expect(chosenAccountId(COMMUNITY_ACCOUNT.primary)).toBeUndefined();
  });

  it('returns the picked account id as a number', () => {
    expect(chosenAccountId('12345')).toBe(12345);
  });

  it('ignores values that are not account ids', () => {
    expect(chosenAccountId('')).toBeUndefined();
    expect(chosenAccountId('abc')).toBeUndefined();
    expect(chosenAccountId('0')).toBeUndefined();
  });
});
