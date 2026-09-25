import type { z } from 'zod';

import type {
  mapDetailSchema,
  mapListSchema,
  mapModeSchema,
  mapParamsSchema,
  mapsQuerySchema,
  mapStatsSchema,
  mapSummarySchema,
  mapTeamStatsSchema
} from './maps.schemas';

export type MapsQuery = z.infer<typeof mapsQuerySchema>;
export type MapParams = z.infer<typeof mapParamsSchema>;
export type MapSummary = z.infer<typeof mapSummarySchema>;
export type MapMode = z.infer<typeof mapModeSchema>;
export type MapTeamStats = z.infer<typeof mapTeamStatsSchema>;
export type MapStats = z.infer<typeof mapStatsSchema>;
export type MapDetail = z.infer<typeof mapDetailSchema>;
export type MapList = z.infer<typeof mapListSchema>;
