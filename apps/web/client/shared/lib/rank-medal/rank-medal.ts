import type { RankMedal } from './rank-medal.types';

import { RANK_MEDAL } from './rank-medal.constants';

export const rankMedal = (rank: number | null): RankMedal | undefined => (rank === null ? undefined : RANK_MEDAL.medals[rank - 1]);
