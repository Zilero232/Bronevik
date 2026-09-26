import type { TankServerStatsRow } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import { summarizeStats } from '../stats-summary';
import { statsRowsFixture } from './stats-summary.fixtures';

const rows: TankServerStatsRow[] = statsRowsFixture([
  { battles: 100, winRateDiff: 1 },
  { battles: 300, winRateDiff: -2 },
  { battles: 50, winRateDiff: 4 }
]);

describe('summarizeStats', () => {
  it('adds up battles across every tank', () => {
    expect(summarizeStats(rows).battles).toBe(rows.reduce((sum, { battles }) => sum + battles, 0));
  });

  it('names the tank with the highest WR diff as the strongest', () => {
    expect(summarizeStats(rows).strongest).toBe(rows[2]);
  });

  it('names the tank with the most battles as the most played', () => {
    expect(summarizeStats(rows).mostPlayed).toBe(rows[1]);
  });

  it('returns no leaders for an empty page', () => {
    expect(summarizeStats([]).strongest).toBeUndefined();
  });
});
