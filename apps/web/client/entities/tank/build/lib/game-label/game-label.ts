import { GAME_LABEL } from './game-label.constants';

export const gameLabel = (raw: string): string => {
  if (!GAME_LABEL.asciiKey.test(raw)) {
    return raw;
  }

  const words = raw
    .replace(GAME_LABEL.locSuffix, '')
    .replace(GAME_LABEL.rolePrefix, '')
    .replace(GAME_LABEL.camelBoundary, '$1 $2')
    .replace(GAME_LABEL.separators, ' ')
    .trim()
    .toLowerCase();

  return words.charAt(0).toUpperCase() + words.slice(1);
};
