import type { GuessFeedback } from '../compare-guess';

export type ShareTextInput = {
  title: string;
  number: number;
  feedback: GuessFeedback[];
  isWon: boolean;
  maxGuesses: number;
  url: string;
};
