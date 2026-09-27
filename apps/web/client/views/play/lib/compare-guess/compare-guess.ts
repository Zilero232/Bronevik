import type { CellHint, CompareGuessInput, GuessFeedback, NumericHintInput, RelativeInput } from './compare-guess.types';

import { GUESS_TOLERANCE } from '../../config';

const MATCH: CellHint = { verdict: 'match', direction: null };

const equal = (isSame: boolean): CellHint => ({ verdict: isSame ? 'match' : 'miss', direction: null });

const numericHint = ({ guess, target, match, close }: NumericHintInput): CellHint => {
  if (guess === null || target === null) {
    return { verdict: 'unknown', direction: null };
  }

  const gap = Math.abs(target - guess);

  if (gap <= match) {
    return MATCH;
  }

  return { verdict: gap <= close ? 'close' : 'miss', direction: target > guess ? 'up' : 'down' };
};

const relative = ({ target, share }: RelativeInput) => (target === null ? 0 : Math.abs(target) * share);

export const compareGuess = ({ guess, target }: CompareGuessInput): GuessFeedback => {
  const isCorrect = guess.vehicle.tankId === target.vehicle.tankId;

  if (isCorrect) {
    return { isCorrect, cells: { tier: MATCH, type: MATCH, nation: MATCH, premium: MATCH, damage: MATCH, winRate: MATCH } };
  }

  return {
    isCorrect,
    cells: {
      tier: numericHint({ guess: guess.vehicle.tier, target: target.vehicle.tier, match: 0, close: GUESS_TOLERANCE.tierClose }),
      type: equal(guess.vehicle.type === target.vehicle.type),
      nation: equal(guess.vehicle.nation === target.vehicle.nation),
      premium: equal(guess.vehicle.isPremium === target.vehicle.isPremium),
      damage: numericHint({
        guess: guess.avgDamage,
        target: target.avgDamage,
        match: relative({ target: target.avgDamage, share: GUESS_TOLERANCE.damageMatch }),
        close: relative({ target: target.avgDamage, share: GUESS_TOLERANCE.damageClose })
      }),
      winRate: numericHint({ guess: guess.winRate, target: target.winRate, match: GUESS_TOLERANCE.winRateMatch, close: GUESS_TOLERANCE.winRateClose })
    }
  };
};
