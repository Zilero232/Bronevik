import type { z } from 'zod';

import type { rawBuildingSchema } from './stronghold.schemas';

export type RawBuilding = z.infer<typeof rawBuildingSchema>;

export type StrongholdProvince = {
  provinceId: string;
  name: string;
  arenaId: string | null;
  dailyRevenue: number | null;
};

export type ToStrongholdInput = {
  clanId: number;
  level: number | null;
  stats: unknown;
  buildings: unknown;
  reserves: unknown;
  updatedAt: Date | null;
  elo: { eloRating6: number | null; eloRating8: number | null; eloRating10: number | null };
  provinces: StrongholdProvince[];
};
