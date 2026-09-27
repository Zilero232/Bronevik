import { COMPETITION } from '@otmetki/schemas';
import { describe, expect, it } from 'vitest';

import type { ScoredLine } from '../competition-scoring.types';

import { competitionStatus, rankTeams, scoreBattles, scoreLine, scoreTotals } from '../competition-scoring';

const scoring = COMPETITION.defaultScoring;

const battle = (overrides: Partial<ScoredLine> = {}): ScoredLine => ({
  damage: 2000,
  assist: 500,
  blocked: 400,
  frags: 1,
  spotted: 2,
  xp: 800,
  wins: 1,
  survived: 0,
  ...overrides
});

describe('scoreLine', () => {
  it('gives each metric its own weight', () => {
    const base = scoreLine({ line: battle(), scoring });

    expect(scoreLine({ line: battle({ frags: 2 }), scoring }) - base).toBe(scoring.frags);
    expect(scoreLine({ line: battle({ wins: 0 }), scoring }) - base).toBe(-scoring.win);
  });
});

describe('scoreBattles', () => {
  it('counts only the first battles up to the limit', () => {
    const battles = [battle(), battle(), battle({ damage: 10_000 })];
    const result = scoreBattles({ battles, scoring, limit: 2 });

    expect(result.battles).toBe(2);
    expect(result.score).toBe(scoreLine({ line: battle(), scoring }) * 2);
  });

  it('scores nobody who has not played', () => {
    expect(scoreBattles({ battles: [], scoring, limit: 10 })).toEqual({ score: 0, battles: 0 });
  });
});

describe('scoreTotals', () => {
  it('scales totals down to the battle limit so extra battles bring no advantage', () => {
    const totals = battle();
    const capped = scoreTotals({ totals: { ...totals, damage: totals.damage * 2 }, battles: 4, scoring, limit: 2 });
    const exact = scoreTotals({ totals: { ...totals, damage: totals.damage }, battles: 2, scoring, limit: 2 });

    expect(capped.battles).toBe(2);
    expect(capped.score).toBeLessThan(exact.score * 2);
  });

  it('keeps the full totals under the limit', () => {
    const totals = battle();

    expect(scoreTotals({ totals, battles: 1, scoring, limit: 5 })).toEqual({ score: scoreLine({ line: totals, scoring }), battles: 1 });
  });

  it('scores nobody without battles, even with leftover totals', () => {
    expect(scoreTotals({ totals: battle(), battles: 0, scoring, limit: 5 })).toEqual({ score: 0, battles: 0 });
  });
});

describe('rankTeams', () => {
  it('gives tied teams the same place and skips the next one', () => {
    const ranks = rankTeams([
      { id: 'a', score: 10, battles: 3 },
      { id: 'b', score: 30, battles: 3 },
      { id: 'c', score: 10, battles: 3 },
      { id: 'd', score: 5, battles: 3 }
    ]);

    expect([ranks.get('b'), ranks.get('a'), ranks.get('c'), ranks.get('d')]).toEqual([1, 2, 2, 4]);
  });
});

describe('competitionStatus', () => {
  const startsAt = new Date('2026-10-01T00:00:00Z');
  const endsAt = new Date('2026-10-02T00:00:00Z');

  it('runs from the start inclusive to the end exclusive', () => {
    expect(competitionStatus({ startsAt, endsAt, now: new Date('2026-09-30T23:59:59Z') })).toBe('upcoming');
    expect(competitionStatus({ startsAt, endsAt, now: startsAt })).toBe('running');
    expect(competitionStatus({ startsAt, endsAt, now: endsAt })).toBe('finished');
  });
});
