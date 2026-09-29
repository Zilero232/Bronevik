import type { z } from 'zod';

import type {
  mapDetailSchema,
  mapListSchema,
  mapModeSchema,
  mapParamsSchema,
  mapRefSchema,
  mapsQuerySchema,
  mapStatsSchema,
  mapSummarySchema,
  mapTankRowSchema,
  mapTanksSchema,
  mapTeamStatsSchema,
  tankMapRowSchema,
  tankMapSampleSchema,
  tankMapsSchema
} from './maps.schemas';

export type MapsQuery = z.infer<typeof mapsQuerySchema>;
export type MapParams = z.infer<typeof mapParamsSchema>;
export type MapSummary = z.infer<typeof mapSummarySchema>;
export type MapMode = z.infer<typeof mapModeSchema>;
export type MapTeamStats = z.infer<typeof mapTeamStatsSchema>;
export type MapStats = z.infer<typeof mapStatsSchema>;
export type MapDetail = z.infer<typeof mapDetailSchema>;
export type MapList = z.infer<typeof mapListSchema>;
export type MapRef = z.infer<typeof mapRefSchema>;
export type TankMapSample = z.infer<typeof tankMapSampleSchema>;
export type TankMapRow = z.infer<typeof tankMapRowSchema>;
export type MapTankRow = z.infer<typeof mapTankRowSchema>;
export type TankMaps = z.infer<typeof tankMapsSchema>;
export type MapTanks = z.infer<typeof mapTanksSchema>;
