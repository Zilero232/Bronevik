export type GameStatus = 'lost' | 'playing' | 'won';

export type GameStatusInput = {
  guessIds: readonly number[];
  targetId: number;
  maxGuesses: number;
};

export type RevealedCluesInput = {
  misses: number;
  total: number;
  isOver: boolean;
};
