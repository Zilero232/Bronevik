import type { z } from 'zod';

import type { GlobalMapProvince } from '../../../../../generated';
import type { rawBuildingSchema } from './stronghold.schemas';

export type RawBuilding = z.infer<typeof rawBuildingSchema>;

export type StrongholdProvince = Pick<GlobalMapProvince, 'arenaId' | 'dailyRevenue' | 'name' | 'provinceId'>;

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
