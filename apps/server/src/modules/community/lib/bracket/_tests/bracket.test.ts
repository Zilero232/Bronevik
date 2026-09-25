import { describe, expect, it } from 'vitest';

import { BracketError, champion, reportWinner, seedBracket, seedOrder } from '../bracket';

describe('seedOrder', () => {
  it('keeps the top two seeds apart until the final', () => {
    const order = seedOrder(8);

    expect(order).toEqual([1, 8, 4, 5, 2, 7, 3, 6]);
    expect(order.indexOf(1) < 4).not.toBe(order.indexOf(2) < 4);
  });
});

describe('seedBracket', () => {
  it('pads to a power of two and gives byes to the best seeds', () => {
    const bracket = seedBracket([10, 20, 30, 40, 50, 60]);
    const first = bracket.rounds[0] ?? [];

    expect(bracket.size).toBe(8);
    expect(bracket.rounds).toHaveLength(3);
    expect(first.filter((match) => match.winner !== null).map((match) => match.winner)).toEqual([10, 20]);
    expect(bracket.rounds[1]?.[0]?.a).toBe(10);
  });

  it('refuses duplicate participants', () => {
    expect(() => seedBracket([1, 1])).toThrow(BracketError);
  });
});

describe('reportWinner', () => {
  it('advances winners up to a champion', () => {
    let bracket = seedBracket([1, 2, 3, 4]);

    bracket = reportWinner({ bracket, round: 0, index: 0, winner: 1 });
    bracket = reportWinner({ bracket, round: 0, index: 1, winner: 3 });

    expect(champion(bracket)).toBeNull();

    bracket = reportWinner({ bracket, round: 1, index: 0, winner: 3 });

    expect(champion(bracket)).toBe(3);
  });

  it('rejects a winner who is not in the match', () => {
    expect(() => reportWinner({ bracket: seedBracket([1, 2, 3, 4]), round: 0, index: 0, winner: 2 })).toThrow(BracketError);
  });

  it('rejects a match whose opponents are not decided', () => {
    expect(() => reportWinner({ bracket: seedBracket([1, 2, 3, 4]), round: 1, index: 0, winner: 1 })).toThrow(BracketError);
  });

  it('does not rewrite a result once the next round is decided', () => {
    let bracket = seedBracket([1, 2, 3, 4]);

    bracket = reportWinner({ bracket, round: 0, index: 0, winner: 1 });
    bracket = reportWinner({ bracket, round: 0, index: 1, winner: 3 });
    bracket = reportWinner({ bracket, round: 1, index: 0, winner: 1 });

    expect(() => reportWinner({ bracket, round: 0, index: 0, winner: 4 })).toThrow(BracketError);
  });

  it('leaves the input bracket untouched', () => {
    const bracket = seedBracket([1, 2]);

    reportWinner({ bracket, round: 0, index: 0, winner: 2 });

    expect(champion(bracket)).toBeNull();
  });
});
