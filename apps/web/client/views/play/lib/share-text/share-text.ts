import type { GuessFeedback } from '../compare-guess';
import type { ShareTextInput } from './share-text.types';

import { GUESS_CELLS, GUESS_SHARE_MARKS } from '../../config';

const row = ({ cells }: GuessFeedback) => GUESS_CELLS.map((key) => GUESS_SHARE_MARKS[cells[key].verdict]).join('');

export const shareText = ({ title, number, feedback, isWon, maxGuesses, url }: ShareTextInput) => {
  const score = isWon ? String(feedback.length) : 'X';

  return [`${title} #${number} ${score}/${maxGuesses}`, '', ...feedback.map(row), '', url].join('\n');
};
