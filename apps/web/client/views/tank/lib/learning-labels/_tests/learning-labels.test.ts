import { describe, expect, it } from 'vitest';

import { bucketLabel } from '../learning-labels';

describe('bucketLabel', () => {
  it('shows a closed range with both ends', () => {
    expect(bucketLabel({ from: 50, to: 100 })).toBe('50–100');
  });

  it('shows the open last bucket with a plus', () => {
    expect(bucketLabel({ from: 250, to: null })).toBe('250+');
  });
});
