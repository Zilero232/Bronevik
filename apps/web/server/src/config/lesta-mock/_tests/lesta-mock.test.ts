import { describe, expect, it } from 'vitest';

import { isRealLestaApplicationId } from '../lesta-mock';
import { LESTA_MOCK } from '../lesta-mock.constants';

describe('isRealLestaApplicationId', () => {
  it('accepts a registered application id', () => {
    expect(isRealLestaApplicationId('0123456789abcdef')).toBe(true);
  });

  it('treats an absent, empty or mock id as no key', () => {
    expect(isRealLestaApplicationId(undefined)).toBe(false);
    expect(isRealLestaApplicationId('')).toBe(false);
    expect(isRealLestaApplicationId(LESTA_MOCK.applicationId)).toBe(false);
  });
});
