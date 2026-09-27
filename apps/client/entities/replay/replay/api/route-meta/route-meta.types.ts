import type { Replay } from '../replays';

export type ReplayRouteMeta = Pick<Replay, 'damageDealt' | 'mapName'> & {
  isPublic: boolean;
  player: string | null;
};
