import { MODPACK_RELEASES } from '@otmetki/schemas';

import type { MatchesGameInput } from './game-match.types';

const parts = (version: string) => version.trim().split('.');

export const matchesGame = ({ pattern, game }: MatchesGameInput): boolean => {
  const wanted = parts(pattern);
  const actual = parts(game);

  for (const [index, part] of wanted.entries()) {
    if (part === MODPACK_RELEASES.wildcard) {
      return true;
    }

    if (Number(part) !== Number(actual[index] ?? 0)) {
      return false;
    }
  }

  return actual.slice(wanted.length).every((part) => Number(part) === 0);
};
