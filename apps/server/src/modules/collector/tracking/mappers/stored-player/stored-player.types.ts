import type { Player } from '../../../../../../generated';

export type StoredPlayerRow = Pick<Player, 'accountId' | 'clanId' | 'lastBattleAt' | 'lastPolledAt' | 'trackingTier'>;
