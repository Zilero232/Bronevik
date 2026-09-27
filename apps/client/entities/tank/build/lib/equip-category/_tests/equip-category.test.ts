import { describe, expect, it } from 'vitest';

import { equipCategory } from '..';

describe('equipCategory', () => {
  it('keeps the known provision variants', () => {
    expect(['standard', 'trophy', 'deluxe', 'modernized'].map(equipCategory)).toEqual(['standard', 'trophy', 'deluxe', 'modernized']);
  });

  it('falls back to standard for a missing or unknown variant', () => {
    expect([equipCategory(null), equipCategory(undefined), equipCategory('legendary')]).toEqual(['standard', 'standard', 'standard']);
  });
});
