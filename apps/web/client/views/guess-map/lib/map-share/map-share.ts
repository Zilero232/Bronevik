import type { MapShareTextInput } from './map-share.types';

import { GUESS_MAP, GUESS_MAP_SHARE } from '../../config';

export const mapShareText = ({ title, number, results, isWon, url }: MapShareTextInput) => {
  const score = isWon ? String(results.length) : 'X';
  const row = results.map((isHit) => (isHit ? GUESS_MAP_SHARE.hit : GUESS_MAP_SHARE.miss)).join('');

  return [`${title} #${number} ${score}/${GUESS_MAP.maxGuesses}`, '', row, '', url].join('\n');
};
