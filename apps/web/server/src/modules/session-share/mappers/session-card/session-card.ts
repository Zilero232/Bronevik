import { clamp } from 'remeda';

import type { SessionCardRow } from '../../selects';
import type { SessionCardNotification } from './session-card.types';

import { toNumber } from '../../../../common/lib';

export const toSessionCard = (row: SessionCardRow): SessionCardNotification | null => {
  if (row.battles <= 0) {
    return null;
  }

  return {
    event: 'sessionFinished',
    accountId: toNumber(row.accountId),
    nickname: row.player.nickname,
    sessionId: row.id,
    battles: row.battles,
    winRate: clamp(row.wins / row.battles, { min: 0, max: 1 }),
    avgDamage: Math.max(0, row.damageDealt) / row.battles,
    wn8: row.wn8
  };
};
