import { describe, expect, it } from 'vitest';

import type { MapTeams } from '../team-stats.types';

import { MAP_TEAMS } from '../../../config';
import { teamWinRates } from '../team-stats';

const TEAMS: MapTeams = [
  { team: MAP_TEAMS.second, battles: 10, winRate: 46 },
  { team: MAP_TEAMS.first, battles: 10, winRate: 52 }
];

describe('teamWinRates', () => {
  it('reads each side by its team number, not by its position', () => {
    const rates = teamWinRates(TEAMS);

    expect(rates.team1).toBe(TEAMS[1]?.winRate);
    expect(rates.team2).toBe(TEAMS[0]?.winRate);
  });

  it('leaves the rest of the battles to draws', () => {
    const { team1, team2, draws } = teamWinRates(TEAMS);

    expect(team1 + team2 + draws).toBe(100);
  });

  it('never reports negative draws', () => {
    expect(
      teamWinRates([
        { team: MAP_TEAMS.first, battles: 1, winRate: 70 },
        { team: MAP_TEAMS.second, battles: 1, winRate: 40 }
      ]).draws
    ).toBe(0);
  });

  it('treats a side without data as zero and keeps an even split when both are empty', () => {
    expect(teamWinRates([]).share).toBe(0.5);
  });
});
