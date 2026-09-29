import { addSeconds, subSeconds } from 'date-fns';
import { describe, expect, it } from 'vitest';

import { daySeed, nextPuzzleAt, previousDay, puzzleDay, puzzleNumber, secondsUntilNextPuzzle } from '../puzzle-day';

const EPOCH = '2026-01-01';

describe('puzzleDay', () => {
  it('rolls over at midnight Moscow time, not UTC', () => {
    const beforeMidnight = new Date(Date.UTC(2026, 8, 24, 20, 59));
    const afterMidnight = new Date(Date.UTC(2026, 8, 24, 21, 1));

    expect(puzzleDay(beforeMidnight)).not.toBe(puzzleDay(afterMidnight));
    expect(previousDay(puzzleDay(afterMidnight))).toBe(puzzleDay(beforeMidnight));
  });
});

describe('puzzleNumber', () => {
  it('counts the epoch day as the first puzzle and grows by one each day', () => {
    expect(puzzleNumber({ epoch: EPOCH, day: EPOCH })).toBe(1);
    expect(puzzleNumber({ epoch: EPOCH, day: '2026-10-02' }) - puzzleNumber({ epoch: EPOCH, day: '2026-10-01' })).toBe(1);
  });
});

describe('nextPuzzleAt', () => {
  it('lands exactly on the next puzzle day', () => {
    const now = new Date(Date.UTC(2026, 8, 24, 12, 34, 56));
    const next = nextPuzzleAt(now);

    expect(previousDay(puzzleDay(next))).toBe(puzzleDay(now));
    expect(puzzleDay(subSeconds(next, 1))).toBe(puzzleDay(now));
  });
});

describe('secondsUntilNextPuzzle', () => {
  it('counts whole seconds up to Moscow midnight', () => {
    const now = new Date(Date.UTC(2026, 8, 24, 20, 59, 30));

    expect(secondsUntilNextPuzzle(now)).toBe(30);
    expect(puzzleDay(addSeconds(now, secondsUntilNextPuzzle(now)))).not.toBe(puzzleDay(now));
  });
});

describe('daySeed', () => {
  it('gives each day its own seed and the same seed for the same day', () => {
    expect(daySeed('2026-09-24')).toBe(daySeed('2026-09-24'));
    expect(daySeed('2026-09-24')).not.toBe(daySeed(previousDay('2026-09-24')));
  });
});
