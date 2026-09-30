import type { PlayerSummary } from '@otmetki/schemas';

export type OwnPlayer = Pick<PlayerSummary, 'accountId' | 'nickname'>;

export type OwnPlayerState = {
  player: OwnPlayer | null;
};
