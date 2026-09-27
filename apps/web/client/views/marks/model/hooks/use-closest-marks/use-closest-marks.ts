'use client';

import { useQueryState } from 'nuqs';

import { PLAYER_URL_PARSER } from '../../../config';

export const useClosestMarks = () => {
  const [player, setPlayer] = useQueryState('player', PLAYER_URL_PARSER.withOptions({ history: 'replace' }));

  const onPick = (value: string) => setPlayer(value || null);

  return { player, onPick };
};
