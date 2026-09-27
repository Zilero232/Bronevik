import { describe, expect, it } from 'vitest';

import { rotationStep } from '../rotation-cycle';

describe('rotationStep', () => {
  it('wraps forward and backward', () => {
    expect(rotationStep({ index: 2, count: 3 })).toBe(0);
    expect(rotationStep({ index: 0, count: 3, step: -1 })).toBe(2);
  });

  it('stays at zero for an empty list', () => {
    expect(rotationStep({ index: 4, count: 0 })).toBe(0);
  });
});
