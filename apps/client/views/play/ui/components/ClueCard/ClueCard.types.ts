import type { GUESS_CLUES } from '../../../config';

export type GuessClue = (typeof GUESS_CLUES)[number];

export type ClueCardProps = {
  clue: GuessClue;
  index: number;
  isRevealed: boolean;
};
