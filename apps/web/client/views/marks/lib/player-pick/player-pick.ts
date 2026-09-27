import type { PlayerSearchResult } from '@otmetki/schemas';

import type { PickedPlayer, PickPlayerInput } from './player-pick.types';

import { PLAYER_QUERY } from '../../config';

export const isAccountId = (value: string): boolean => PLAYER_QUERY.accountId.test(value);

export const pickPlayer = ({ player, results }: PickPlayerInput): PickedPlayer => {
  const players = results.filter((result): result is PlayerSearchResult => result.kind === 'player');
  const needle = player.toLowerCase();

  return players.find(({ nickname }) => nickname.toLowerCase() === needle) ?? players.at(0) ?? null;
};
