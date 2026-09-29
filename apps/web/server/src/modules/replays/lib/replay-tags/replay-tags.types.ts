import type { Replay } from '../../../../../generated';

export type Fighter = {
  team: number;
  isRecorder: boolean;
  diedAt: number | null;
  damage: number;
  frags: number;
  capturePoints: number;
  maxHealth: number | null;
};

export type AliveAtInput = {
  fighters: readonly Fighter[];
  team: number;
  at: number;
};

export type TagContext = {
  fighters: readonly Fighter[];
  recorder: Fighter;
  allies: readonly Fighter[];
  enemies: readonly Fighter[];
  enemyTeam: number;
  finishReason: number | null;
};

export type ReplayTagColumns = Pick<Replay, 'clanTag' | 'damageBlocked' | 'markOfMastery' | 'tags' | 'tagsVersion'>;
