import type { z } from 'zod';

import type {
  modeMetaQuerySchema,
  modeMetaSchema,
  modeRankSchema,
  modeSeasonSchema,
  modesHubSchema,
  modeSummarySchema,
  modeTankSchema,
  myModeLineSchema,
  myModeStatsQuerySchema,
  myModeStatsSchema,
  myModeTankSchema,
  playModeSchema
} from './modes.schemas';

export type PlayMode = z.infer<typeof playModeSchema>;
export type ModeRank = z.infer<typeof modeRankSchema>;
export type ModeMetaQuery = z.infer<typeof modeMetaQuerySchema>;
export type ModeTank = z.infer<typeof modeTankSchema>;
export type ModeSeason = z.infer<typeof modeSeasonSchema>;
export type ModeMeta = z.infer<typeof modeMetaSchema>;
export type ModeSummary = z.infer<typeof modeSummarySchema>;
export type ModesHub = z.infer<typeof modesHubSchema>;
export type MyModeStatsQuery = z.infer<typeof myModeStatsQuerySchema>;
export type MyModeTank = z.infer<typeof myModeTankSchema>;
export type MyModeLine = z.infer<typeof myModeLineSchema>;
export type MyModeStats = z.infer<typeof myModeStatsSchema>;
