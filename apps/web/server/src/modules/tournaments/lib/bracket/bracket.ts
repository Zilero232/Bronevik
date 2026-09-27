import type { Bracket, BracketMatch, PlaceWinnerInput, ReportWinnerInput } from './bracket.types';

export class BracketError extends Error {}

export const seedOrder = (size: number): number[] => {
  let order = [1];

  while (order.length < size) {
    const next = order.length * 2 + 1;

    order = order.flatMap((seed) => [seed, next - seed]);
  }

  return order;
};

const nextPowerOfTwo = (value: number): number => 2 ** Math.ceil(Math.log2(Math.max(2, value)));

const byeWinner = (match: Pick<BracketMatch, 'a' | 'b'>): number | null => {
  if (match.a !== null && match.b === null) {
    return match.a;
  }

  return match.a === null && match.b !== null ? match.b : null;
};

const placeWinner = ({ rounds, round, index, winner }: PlaceWinnerInput): void => {
  const next = rounds[round + 1]?.[Math.floor(index / 2)];

  if (!next) {
    return;
  }

  if (index % 2 === 0) {
    next.a = winner;
  } else {
    next.b = winner;
  }
};

export const seedBracket = (seeded: readonly number[]): Bracket => {
  if (new Set(seeded).size !== seeded.length) {
    throw new BracketError('Participants must be unique');
  }

  const size = nextPowerOfTwo(seeded.length);
  const order = seedOrder(size);
  const roundCount = Math.log2(size);
  const rounds: BracketMatch[][] = Array.from({ length: roundCount }, (_, round) =>
    Array.from({ length: size / 2 ** (round + 1) }, (_unused, index) => ({ round, index, a: null, b: null, winner: null }))
  );

  const first = rounds[0] ?? [];

  for (const match of first) {
    match.a = seeded[(order[match.index * 2] ?? 0) - 1] ?? null;
    match.b = seeded[(order[match.index * 2 + 1] ?? 0) - 1] ?? null;
    match.winner = byeWinner(match);
    placeWinner({ rounds, round: 0, index: match.index, winner: match.winner });
  }

  return { size, rounds };
};

export const reportWinner = ({ bracket, round, index, winner }: ReportWinnerInput): Bracket => {
  const rounds = bracket.rounds.map((matches) => matches.map((match) => ({ ...match })));
  const match = rounds[round]?.[index];

  if (!match) {
    throw new BracketError(`No match ${round}:${index}`);
  }

  if (match.a === null || match.b === null) {
    throw new BracketError('Both sides of the match are not known yet');
  }

  if (winner !== match.a && winner !== match.b) {
    throw new BracketError('The winner must play in this match');
  }

  const next = rounds[round + 1]?.[Math.floor(index / 2)];

  if (next && next.winner !== null) {
    throw new BracketError('A later match already has a result');
  }

  match.winner = winner;
  placeWinner({ rounds, round, index, winner });

  return { size: bracket.size, rounds };
};

export const champion = (bracket: Bracket): number | null => bracket.rounds.at(-1)?.[0]?.winner ?? null;
