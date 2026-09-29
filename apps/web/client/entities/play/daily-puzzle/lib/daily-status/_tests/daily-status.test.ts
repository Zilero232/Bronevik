import { describe, expect, it } from 'vitest';

import { EMPTY_STREAK } from '../../../config';
import { previousDay } from '../../puzzle-day';
import { recordResult } from '../../streak';
import { dailyStatus } from '../daily-status';

const TODAY = '2026-09-29';
const YESTERDAY = previousDay(TODAY);

describe('dailyStatus', () => {
  it('offers a fresh puzzle to a visitor who has not played today', () => {
    expect(dailyStatus({ streak: EMPTY_STREAK, today: TODAY, attempts: 0 }).kind).toBe('fresh');
  });

  it('reports a puzzle in progress once a guess is made but the game is not over', () => {
    expect(dailyStatus({ streak: EMPTY_STREAK, today: TODAY, attempts: 2 })).toEqual({ kind: 'playing', streak: 0, attempts: 2, isDone: false });
  });

  it('reports today as solved after a win recorded today', () => {
    const streak = recordResult({ streak: EMPTY_STREAK, day: TODAY, isWon: true });

    expect(dailyStatus({ streak, today: TODAY, attempts: 3 })).toMatchObject({ kind: 'solved', isDone: true });
  });

  it('reports today as failed after a loss recorded today', () => {
    const won = recordResult({ streak: EMPTY_STREAK, day: YESTERDAY, isWon: true });
    const streak = recordResult({ streak: won, day: TODAY, isWon: false });

    expect(dailyStatus({ streak, today: TODAY, attempts: 6 })).toMatchObject({ kind: 'failed', streak: 0, isDone: true });
  });

  it('keeps yesterday’s streak alive until today is played', () => {
    const streak = recordResult({ streak: EMPTY_STREAK, day: YESTERDAY, isWon: true });
    const status = dailyStatus({ streak, today: TODAY, attempts: 0 });

    expect(status).toEqual({ kind: 'fresh', streak: streak.current, attempts: 0, isDone: false });
  });

  it('drops a streak that skipped a day', () => {
    const streak = recordResult({ streak: EMPTY_STREAK, day: previousDay(YESTERDAY), isWon: true });

    expect(dailyStatus({ streak, today: TODAY, attempts: 0 }).streak).toBe(0);
  });
});
