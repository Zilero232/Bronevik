import { describe, expect, it } from 'vitest';

import { GUESS_CLUES, GUESS_TANK } from '../../../config';
import { gameStatus, revealedClues } from '../game-status';

const TARGET = 7;
const MISSES = Array.from({ length: GUESS_TANK.maxGuesses }, (_, index) => 100 + index);
const TOTAL = GUESS_CLUES.length;

describe('gameStatus', () => {
  it('keeps playing while guesses remain', () => {
    expect(gameStatus({ guessIds: MISSES.slice(0, -1), targetId: TARGET, maxGuesses: GUESS_TANK.maxGuesses })).toBe('playing');
  });

  it('is won as soon as the target is guessed, even on the last try', () => {
    expect(gameStatus({ guessIds: [...MISSES.slice(0, -1), TARGET], targetId: TARGET, maxGuesses: GUESS_TANK.maxGuesses })).toBe('won');
  });

  it('is lost once every guess missed', () => {
    expect(gameStatus({ guessIds: MISSES, targetId: TARGET, maxGuesses: GUESS_TANK.maxGuesses })).toBe('lost');
  });
});

describe('revealedClues', () => {
  it('shows no clue before the first miss', () => {
    expect(revealedClues({ misses: 0, total: TOTAL, isOver: false })).toBe(0);
  });

  it('opens one clue per miss and never more than exist', () => {
    expect(revealedClues({ misses: 2, total: TOTAL, isOver: false })).toBe(2);
    expect(revealedClues({ misses: TOTAL + 3, total: TOTAL, isOver: false })).toBe(TOTAL);
  });

  it('opens everything once the game is over', () => {
    expect(revealedClues({ misses: 0, total: TOTAL, isOver: true })).toBe(TOTAL);
  });
});
