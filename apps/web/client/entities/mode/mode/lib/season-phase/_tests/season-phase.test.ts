import type { ModeSeason } from '@otmetki/schemas';

import { addDays, subDays } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { seasonPhase } from '../season-phase';

const NOW = new Date(2026, 8, 26, 12);

const season = (startsAt: Date, endsAt: Date | null): ModeSeason => ({
  title: 'Season',
  url: null,
  startsAt: startsAt.toISOString(),
  endsAt: endsAt?.toISOString() ?? null
});

describe('seasonPhase', () => {
  it('treats a season that has started and not ended as current', () => {
    expect(seasonPhase({ season: season(subDays(NOW, 3), addDays(NOW, 3)), now: NOW })).toBe('current');
  });

  it('keeps an open-ended season current', () => {
    expect(seasonPhase({ season: season(subDays(NOW, 3), null), now: NOW })).toBe('current');
  });

  it('marks a season that has not started yet as upcoming', () => {
    expect(seasonPhase({ season: season(addDays(NOW, 1), addDays(NOW, 30)), now: NOW })).toBe('upcoming');
  });

  it('marks a season that already ended as past', () => {
    expect(seasonPhase({ season: season(subDays(NOW, 30), subDays(NOW, 1)), now: NOW })).toBe('past');
  });
});
