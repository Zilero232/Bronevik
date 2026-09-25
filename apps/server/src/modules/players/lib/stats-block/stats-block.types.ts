export type TotalsStatsInput = {
  battles: number;
  wins: number;
  damageDealt: number;
  frags: number;
  spotted: number;
  xp?: number;
  survived?: number;
  hits?: number;
  shots?: number;
  avgBlocked?: number | null;
  avgAssisted?: number | null;
  avgTier?: number | null;
  wn8?: number | null;
  eff?: number | null;
  broneIndex?: number | null;
};

export type RatingStatsInput = {
  battles: number;
  winRate: number;
  avgDamage: number;
  avgFrags: number;
  avgXp?: number | null;
  avgTier?: number | null;
  wn8?: number | null;
  eff?: number | null;
  broneIndex?: number | null;
};

export type RatingFieldsInput = Pick<RatingStatsInput, 'avgTier' | 'broneIndex' | 'eff' | 'wn8'>;
