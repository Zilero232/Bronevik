import { describe, expect, it } from 'vitest';

import { splitDuration, teamShare } from '../battle-duration';

describe('splitDuration', () => {
  it('splits seconds into whole minutes and the remainder', () => {
    const { minutes, seconds } = splitDuration(372);

    expect(minutes * 60 + seconds).toBe(372);
    expect(seconds).toBeLessThan(60);
  });

  it('rounds fractional seconds', () => {
    expect(splitDuration(59.6)).toEqual({ minutes: 1, seconds: 0 });
  });

  it('never returns a negative duration', () => {
    expect(splitDuration(-5)).toEqual({ minutes: 0, seconds: 0 });
  });
});

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
