import type { GameStatus, GameStatusInput, RevealedCluesInput } from './game-status.types';

export const gameStatus = ({ guessIds, targetId, maxGuesses }: GameStatusInput): GameStatus => {
  if (guessIds.includes(targetId)) {
    return 'won';
  }

  return guessIds.length >= maxGuesses ? 'lost' : 'playing';
};

export const revealedClues = ({ misses, total, isOver }: RevealedCluesInput) => (isOver ? total : Math.min(Math.max(misses, 0), total));
