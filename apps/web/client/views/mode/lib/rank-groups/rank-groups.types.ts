import type { ModeRank, ModeTank } from '@otmetki/schemas';

export type RankGroup = {
  rank: ModeRank | null;
  tanks: ModeTank[];
};
