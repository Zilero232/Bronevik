import type { RANK_MEDAL } from './rank-medal.constants';

export type RankMedal = (typeof RANK_MEDAL.medals)[number];
