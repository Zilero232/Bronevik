import { describe, expect, it } from 'vitest';

import { teamShare } from '../battle-duration';

describe('teamShare', () => {
  it('splits evenly when both teams win equally often', () => {
    expect(teamShare({ team1: 50, team2: 50 })).toBe(0.5);
  });

  it('leans towards the team that wins more', () => {
    expect(teamShare({ team1: 52, team2: 46 })).toBeGreaterThan(0.5);
  });

  it('stays neutral without any wins', () => {
    expect(teamShare({ team1: 0, team2: 0 })).toBe(0.5);
  });
});
