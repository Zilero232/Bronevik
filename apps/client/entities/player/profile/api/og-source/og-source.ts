import type { PlayerSessionOgSourceInput } from './og-source.types';

import { getPlayer, getPlayerSession } from '../players';

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
