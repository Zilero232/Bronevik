import { describe, expect, it } from 'vitest';

import { toggleItem } from '../settings-toggle';

describe('toggleItem', () => {
  it('adds a missing item and removes a present one', () => {
    expect(toggleItem({ list: ['site'], item: 'telegram' })).toEqual(['site', 'telegram']);
    expect(toggleItem({ list: ['site', 'telegram'], item: 'telegram' })).toEqual(['site']);
  });
});
