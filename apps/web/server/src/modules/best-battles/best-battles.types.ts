import type { z } from 'zod';

import type { BEST_BATTLE_SOURCES } from './config';
import type {
  bestBattleMetricSchema,
  bestBattlePeriodSchema,
  bestBattleSchema,
  bestBattlesFacetsQuerySchema,
  bestBattlesFacetsSchema,
  bestBattlesPageSchema,
  bestBattlesQuerySchema
} from './dto';

export type BestBattlePeriod = z.infer<typeof bestBattlePeriodSchema>;

export type BestBattleMetric = z.infer<typeof bestBattleMetricSchema>;

export type BestBattleSource = (typeof BEST_BATTLE_SOURCES)[number];

export type BestBattlesQuery = z.infer<typeof bestBattlesQuerySchema>;

export type BestBattlesFacetsQuery = z.infer<typeof bestBattlesFacetsQuerySchema>;

export type BestBattle = z.infer<typeof bestBattleSchema>;

export type BestBattlesPage = z.infer<typeof bestBattlesPageSchema>;

export type BestBattlesFacets = z.infer<typeof bestBattlesFacetsSchema>;

export type BestBattleRow = {
  source: BestBattleSource;
  battle_id: string;
  account_id: bigint;
  arena_unique_id: bigint | null;
  nickname: string | null;
  tank_id: number;
  arena_id: string | null;
  map_name: string | null;
  result: BestBattle['result'];
  damage: number | null;
  assisted: number | null;
  spotted: number | null;
  frags: number | null;
  xp: number | null;
  blocked: number | null;
  medals: string[];
  played_at: Date;
  replay_id: string | null;
};

export type LookupsInput = {
  tankIds: readonly number[];
  arenaIds: readonly string[];
  medalNames: readonly string[];
};

export type TankScopeInput = Pick<BestBattlesQuery, 'tankId' | 'tier' | 'type'>;

export type FeedPageInput = {
  query: BestBattlesQuery;
  now: Date;
};

export type FacetsInput = {
  query: BestBattlesFacetsQuery;
  now: Date;
};
