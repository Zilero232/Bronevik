import type { StoredPlayer } from '../../lib/poll-pipeline';
import type { StoredPlayerRow } from './stored-player.types';

export const toStoredPlayer = (player: StoredPlayerRow): StoredPlayer => ({
  accountId: Number(player.accountId),
  clanId: player.clanId === null ? null : Number(player.clanId),
  lastBattleAt: player.lastBattleAt,
  lastPolledAt: player.lastPolledAt,
  trackingTier: player.trackingTier
});
