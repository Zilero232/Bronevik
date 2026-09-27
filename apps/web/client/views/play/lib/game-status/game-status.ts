import { clamp } from 'remeda';

import type { GameStatus, GameStatusInput, RevealedCluesInput } from './game-status.types';

export const gameStatus = ({ guessIds, targetId, maxGuesses }: GameStatusInput): GameStatus => {
  if (guessIds.includes(targetId)) {
    return 'won';
  }

  return guessIds.length >= maxGuesses ? 'lost' : 'playing';
};

export const revealedClues = ({ misses, total, isOver }: RevealedCluesInput) => (isOver ? total : clamp(misses, { min: 0, max: total }));
