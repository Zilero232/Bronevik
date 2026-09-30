import { createStoredStore } from '@/shared/lib';

import type { OwnPlayer, OwnPlayerState } from './own-player-store.types';

import { OWN_PLAYER } from '../../config';
import { ownPlayerStateSchema } from './own-player-store.schemas';

export const parseOwnPlayer = (value: unknown): OwnPlayerState => {
  const parsed = ownPlayerStateSchema.safeParse(value);

  return { player: parsed.success ? parsed.data.player : null };
};

export const ownPlayerStore = createStoredStore({ key: OWN_PLAYER.storageKey, parse: parseOwnPlayer });

export const rememberOwnPlayer = ({ accountId, nickname }: OwnPlayer) => ownPlayerStore.write({ player: { accountId, nickname } });

export const forgetOwnPlayer = () => ownPlayerStore.write(null);
