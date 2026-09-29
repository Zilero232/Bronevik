import { describe, expect, it } from 'vitest';

import { rankMedal } from '..';

describe('rankMedal', () => {
  it('gives the podium places their medals', () => {
    expect([1, 2, 3].map(rankMedal)).toEqual(['gold', 'silver', 'bronze']);
  });

  it('gives no medal off the podium or without a rank', () => {
    expect(rankMedal(4)).toBeUndefined();
    expect(rankMedal(0)).toBeUndefined();
    expect(rankMedal(null)).toBeUndefined();
  });
});
