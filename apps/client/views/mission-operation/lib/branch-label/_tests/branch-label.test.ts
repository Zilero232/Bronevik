import { describe, expect, it } from 'vitest';

import { knownBranch } from '../branch-label';

describe('knownBranch', () => {
  it('accepts branch keys the UI has labels for', () => {
    expect(knownBranch('AT-SPG')).toBe('AT-SPG');
    expect(knownBranch('Alliance-USSR')).toBe('Alliance-USSR');
    expect(knownBranch('Alliance-Mars')).toBeNull();
  });
});
