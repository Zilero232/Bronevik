import type { CellVerdict, GuessFeedback } from '../compare-guess';
import type { ShareTextInput } from './share-text.types';

import { GUESS_CELLS } from '../../config';

export const VERDICT_EMOJI: Record<CellVerdict, string> = {
  match: '🟩',
  close: '🟨',
  miss: '🟥',
  unknown: '⬛'
};

const row = ({ cells }: GuessFeedback) => GUESS_CELLS.map((key) => VERDICT_EMOJI[cells[key].verdict]).join('');

export const shareText = ({ title, number, feedback, isWon, maxGuesses, url }: ShareTextInput) => {
  const score = isWon ? String(feedback.length) : 'X';

  return [`${title} #${number} ${score}/${maxGuesses}`, '', ...feedback.map(row), '', url].join('\n');
};
