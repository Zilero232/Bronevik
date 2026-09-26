import { describe, expect, it } from 'vitest';

import { readRequirements, unmetRequirements } from '../requirements';

const stats = { battles: 5000, wn8: 1500, winRate: 0.52 };

describe('unmetRequirements', () => {
  it('passes anyone when nothing is required, even without stats', () => {
    expect(unmetRequirements({ stats: null, requirements: {} })).toEqual([]);
  });

  it('needs stats as soon as something is required', () => {
    expect(unmetRequirements({ stats: null, requirements: { minBattles: 1 } })).toEqual(['noStats']);
  });

  it('accepts values exactly on the boundary', () => {
    expect(unmetRequirements({ stats, requirements: { minBattles: 5000, minWn8: 1500, maxWn8: 1500, minWinRate: 0.52 } })).toEqual([]);
  });

  it('lists every unmet requirement', () => {
    expect(unmetRequirements({ stats, requirements: { minBattles: 6000, maxWn8: 1000 } })).toEqual(['minBattles', 'maxWn8']);
  });

  it('fails a rating requirement when the rating is unknown', () => {
    expect(unmetRequirements({ stats: { ...stats, wn8: null }, requirements: { minWn8: 0 } })).toEqual(['minWn8']);
  });
});

describe('readRequirements', () => {
  it('drops a malformed stored value instead of throwing', () => {
    expect(readRequirements({ minWn8: 'high' })).toEqual({});
    expect(readRequirements(null)).toEqual({});
  });
});
