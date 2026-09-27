import { PLAYLIST_REASONS } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { PlaylistCandidate } from '../playlist.types';

import { PLAYLIST_RULES } from '../../../config';
import { buildPlaylist, seededRandom } from '../playlist';

const candidate = (tankId: number, overrides: Partial<PlaylistCandidate> = {}): PlaylistCandidate => ({
  tankId,
  tier: 10,
  battles: 100,
  winRate: 50,
  moePercent: null,
  nextMarkPercent: null,
  daysSinceBattle: 1,
  isFirstWinAvailable: false,
  isMission: false,
  ...overrides
});

const CANDIDATES = [
  candidate(1, { moePercent: 84, nextMarkPercent: 85 }),
  candidate(2, { isFirstWinAvailable: true }),
  candidate(3, { daysSinceBattle: PLAYLIST_RULES.longUnplayedDays }),
  candidate(4, { winRate: PLAYLIST_RULES.lowWinRate - 1 }),
  candidate(5, { isMission: true }),
  candidate(6),
  candidate(7, { tier: PLAYLIST_RULES.minTier - 1, isFirstWinAvailable: true })
];

describe('seededRandom', () => {
  it('repeats the sequence for the same seed and stays in [0, 1)', () => {
    const first = seededRandom(42);
    const second = seededRandom(42);
    const values = Array.from({ length: 20 }, () => first());

    expect(values).toEqual(Array.from({ length: 20 }, () => second()));
    expect(values.every((value) => value >= 0 && value < 1)).toBe(true);
  });
});

describe('buildPlaylist', () => {
  it('only suggests tanks with a reason and skips low tiers', () => {
    const picks = buildPlaylist({ candidates: CANDIDATES, size: 10, reasons: PLAYLIST_REASONS, seed: 1 });
    const ids = picks.map((pick) => pick.candidate.tankId);

    expect(ids).not.toContain(6);
    expect(ids).not.toContain(7);
    expect(picks.every((pick) => pick.reasons.length > 0)).toBe(true);
  });

  it('uses only the allowed reasons', () => {
    const picks = buildPlaylist({ candidates: CANDIDATES, size: 10, reasons: ['firstWin'], seed: 1 });

    expect(picks.map((pick) => pick.candidate.tankId)).toEqual([2]);
  });

  it('respects the size and is stable for a seed', () => {
    const input = { candidates: CANDIDATES, size: 2, reasons: PLAYLIST_REASONS, seed: 7 };

    expect(buildPlaylist(input)).toHaveLength(2);
    expect(buildPlaylist(input)).toEqual(buildPlaylist(input));
  });
});
