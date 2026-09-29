import { describe, expect, it } from 'vitest';

import { EMPTY_STREAK } from '../../../config';
import { previousDay } from '../../puzzle-day';
import { activeStreak, recordResult } from '../streak';

const TODAY = '2026-09-24';
const YESTERDAY = previousDay(TODAY);

describe('recordResult', () => {
  it('starts a streak with the first win', () => {
    expect(recordResult({ streak: EMPTY_STREAK, day: TODAY, isWon: true }).current).toBe(1);
  });

  it('extends the streak after a win on the previous day', () => {
    const streak = recordResult({ streak: EMPTY_STREAK, day: YESTERDAY, isWon: true });

    expect(recordResult({ streak, day: TODAY, isWon: true }).current).toBe(streak.current + 1);
  });

  it('restarts from one when a day was skipped', () => {
    const streak = { ...EMPTY_STREAK, current: 5, best: 5, lastDay: previousDay(YESTERDAY) };

    expect(recordResult({ streak, day: TODAY, isWon: true }).current).toBe(1);
  });

  it('drops the streak on a loss but keeps the best run', () => {
    const streak = { ...EMPTY_STREAK, current: 4, best: 4, lastDay: YESTERDAY };
    const next = recordResult({ streak, day: TODAY, isWon: false });

    expect(next.current).toBe(0);
    expect(next.best).toBe(streak.best);
  });

  it('counts a day only once', () => {
    const once = recordResult({ streak: EMPTY_STREAK, day: TODAY, isWon: true });

    expect(recordResult({ streak: once, day: TODAY, isWon: true })).toBe(once);
  });

  it('tracks games played and won', () => {
    const lost = recordResult({ streak: EMPTY_STREAK, day: YESTERDAY, isWon: false });
    const won = recordResult({ streak: lost, day: TODAY, isWon: true });

    expect(won.played).toBe(lost.played + 1);
    expect(won.wins).toBe(lost.wins + 1);
  });
});

describe('activeStreak', () => {
  it('keeps a streak alive until today is played', () => {
    expect(activeStreak({ streak: { ...EMPTY_STREAK, current: 3, lastDay: YESTERDAY }, today: TODAY })).toBe(3);
  });

  it('shows zero once a whole day was missed', () => {
    expect(activeStreak({ streak: { ...EMPTY_STREAK, current: 3, lastDay: previousDay(YESTERDAY) }, today: TODAY })).toBe(0);
  });
});
