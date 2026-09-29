import { describe, expect, it } from 'vitest';

import { GUESS_MAP, GUESS_MAP_SHARE } from '../../../config';
import { mapShareText } from '../map-share';

const INPUT = { title: 'Guess the map', number: 7, url: 'https://triotmetki.ru/play/guess-map' };

describe('mapShareText', () => {
  it('scores a win by the number of guesses and marks each guess without naming the map', () => {
    const text = mapShareText({ ...INPUT, results: [false, true], isWon: true });

    expect(text.split('\n')[0]).toBe(`${INPUT.title} #${INPUT.number} 2/${GUESS_MAP.maxGuesses}`);
    expect(text).toContain(`${GUESS_MAP_SHARE.miss}${GUESS_MAP_SHARE.hit}`);
    expect(text.endsWith(INPUT.url)).toBe(true);
  });

  it('scores a loss as X', () => {
    expect(mapShareText({ ...INPUT, results: [false], isWon: false }).split('\n')[0]).toContain(` X/${GUESS_MAP.maxGuesses}`);
  });
});
