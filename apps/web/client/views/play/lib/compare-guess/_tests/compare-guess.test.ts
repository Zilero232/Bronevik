import type { VehicleSummary } from '@otmetki/schemas';

import { describe, expect, it } from 'vitest';

import type { GuessSubject } from '../compare-guess.types';

import { GUESS_CELLS, GUESS_TOLERANCE } from '../../../config';
import { compareGuess } from '../compare-guess';

type SubjectInput = {
  vehicle?: Partial<VehicleSummary>;
  avgDamage?: number | null;
  winRate?: number | null;
};

const subject = ({ vehicle = {}, avgDamage = 2_000, winRate = 50 }: SubjectInput = {}): GuessSubject => ({
  vehicle: {
    tankId: 1,
    tier: 8,
    isPremium: false,
    name: 'T',
    shortName: 'T',
    slug: 't',
    nation: 'ussr',
    type: 'heavyTank',
    isCollectible: false,
    status: 'researchable',
    images: { small: null, contour: null, big: null },
    ...vehicle
  },
  avgDamage,
  winRate
});

const TARGET = subject();
const TARGET_DAMAGE = TARGET.avgDamage ?? 0;
const TARGET_WIN_RATE = TARGET.winRate ?? 0;

const other = (input: SubjectInput = {}) => subject({ ...input, vehicle: { tankId: 2, ...input.vehicle } });

describe('compareGuess', () => {
  it('marks every cell as a match for the right tank', () => {
    const { isCorrect, cells } = compareGuess({ guess: TARGET, target: TARGET });

    expect(isCorrect).toBe(true);
    GUESS_CELLS.forEach((key) => expect(cells[key].verdict).toBe('match'));
  });

  it('points up when the hidden tank has a higher tier', () => {
    const { cells } = compareGuess({ guess: other({ vehicle: { tier: TARGET.vehicle.tier - 2 } }), target: TARGET });

    expect(cells.tier).toEqual({ verdict: 'miss', direction: 'up' });
  });

  it('calls a tier one step away close and points down from above', () => {
    const { cells } = compareGuess({ guess: other({ vehicle: { tier: TARGET.vehicle.tier + GUESS_TOLERANCE.tierClose } }), target: TARGET });

    expect(cells.tier).toEqual({ verdict: 'close', direction: 'down' });
  });

  it('matches class, nation and premium flags independently of the tier', () => {
    const { cells } = compareGuess({ guess: other({ vehicle: { tier: 5, nation: 'germany', isPremium: true } }), target: TARGET });

    expect(cells.type.verdict).toBe('match');
    expect(cells.nation.verdict).toBe('miss');
    expect(cells.premium.verdict).toBe('miss');
  });

  it('treats damage within the match tolerance as a hit', () => {
    const avgDamage = TARGET_DAMAGE * (1 - GUESS_TOLERANCE.damageMatch / 2);

    expect(compareGuess({ guess: other({ avgDamage }), target: TARGET }).cells.damage.verdict).toBe('match');
  });

  it('separates close damage from a clear miss', () => {
    const close = TARGET_DAMAGE * (1 + (GUESS_TOLERANCE.damageMatch + GUESS_TOLERANCE.damageClose) / 2);
    const far = TARGET_DAMAGE * (1 + GUESS_TOLERANCE.damageClose * 2);

    expect(compareGuess({ guess: other({ avgDamage: close }), target: TARGET }).cells.damage).toEqual({ verdict: 'close', direction: 'down' });
    expect(compareGuess({ guess: other({ avgDamage: far }), target: TARGET }).cells.damage.verdict).toBe('miss');
  });

  it('says unknown instead of guessing when stats are missing', () => {
    const { cells } = compareGuess({ guess: other({ winRate: null }), target: TARGET });

    expect(cells.winRate).toEqual({ verdict: 'unknown', direction: null });
  });

  it('reads win rate as a ratio and points to the better side', () => {
    const winRate = TARGET_WIN_RATE - GUESS_TOLERANCE.winRateClose * 2;

    expect(compareGuess({ guess: other({ winRate }), target: TARGET }).cells.winRate).toEqual({ verdict: 'miss', direction: 'up' });
  });
});
