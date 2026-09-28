import type { PlayerWrapped } from '@/entities/player/profile';

import type { WRAPPED_CHAPTERS } from '../../config';

export type WrappedChapter = (typeof WRAPPED_CHAPTERS)[number];

export type WrappedYearsInput = {
  now: Date | null;
  year: number;
  createdAt: string | null;
  lastBattleAt: string | null;
};

export type WrappedStoryData = Pick<
  PlayerWrapped,
  'badges' | 'battles' | 'bestBattle' | 'damageDealt' | 'marksGained' | 'masteriesGained' | 'topTanks'
>;
