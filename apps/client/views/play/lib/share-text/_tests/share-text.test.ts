import { describe, expect, it } from 'vitest';

import type { CellVerdict, GuessFeedback } from '../../compare-guess';

import { GUESS_CELLS, GUESS_SHARE_MARKS } from '../../../config';
import { shareText } from '../share-text';

const feedback = (verdict: Exclude<CellVerdict, 'unknown'>): GuessFeedback => {
  const hint = { verdict, direction: null };

  return { isCorrect: verdict === 'match', cells: { tier: hint, type: hint, nation: hint, premium: hint, damage: hint, winRate: hint } };
};

const BASE = { title: 'Guess', number: 42, maxGuesses: 6, url: 'https://example.test/play' };

describe('shareText', () => {
  it('shows the number of tries on a win', () => {
    const text = shareText({ ...BASE, feedback: [feedback('miss'), feedback('match')], isWon: true });

    expect(text.split('\n')[0]).toBe(`${BASE.title} #${BASE.number} 2/${BASE.maxGuesses}`);
  });

  it('marks a loss with an X', () => {
    const text = shareText({ ...BASE, feedback: [feedback('miss')], isWon: false });

    expect(text.split('\n')[0]).toContain(`X/${BASE.maxGuesses}`);
  });

  it('draws one row per guess with one mark per cell', () => {
    const lines = shareText({ ...BASE, feedback: [feedback('close'), feedback('match')], isWon: true }).split('\n');

    expect(lines).toContain(GUESS_SHARE_MARKS.close.repeat(GUESS_CELLS.length));

    expect(lines.indexOf(GUESS_SHARE_MARKS.match.repeat(GUESS_CELLS.length))).toBe(
      lines.indexOf(GUESS_SHARE_MARKS.close.repeat(GUESS_CELLS.length)) + 1
    );
  });

  it('ends with the link so the text works as an invite', () => {
    const text = shareText({ ...BASE, feedback: [feedback('match')], isWon: true });

    expect(text.split('\n').at(-1)).toBe(BASE.url);
  });
});
