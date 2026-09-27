import type { PlayerSessionOgSourceInput, PlayerWrappedOgSourceInput } from './og-source.types';

import { getPlayer, getPlayerSession } from '../players';
import { getPlayerWrapped } from '../wrapped';

export const playerOgSource = async (idOrNick: string) => {
  'use cache';

  return getPlayer({ idOrNick });
};

export const playerSessionOgSource = async ({ idOrNick, sessionId }: PlayerSessionOgSourceInput) => {
  'use cache';

  const { summary } = await getPlayer({ idOrNick });
  const session = await getPlayerSession({ accountId: summary.accountId, sessionId });

  return { nickname: summary.nickname, session };
};

export const playerWrappedOgSource = async ({ idOrNick, year }: PlayerWrappedOgSourceInput) => {
  'use cache';

  const { summary } = await getPlayer({ idOrNick });
  const wrapped = await getPlayerWrapped({ accountId: summary.accountId, year });

  return { nickname: summary.nickname, wrapped };
};
