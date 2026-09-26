import type { z } from 'zod';

import type {
  analyticsExportSchema,
  exportedAccountSchema,
  exportedBattleSchema,
  exportedOverallSchema,
  exportedSessionSchema,
  exportedTankProgressSchema,
  exportedTankSchema,
  rawStatsExportSchema
} from './data-export.schemas';

export type ExportedOverall = z.infer<typeof exportedOverallSchema>;
export type ExportedTank = z.infer<typeof exportedTankSchema>;
export type ExportedAccount = z.infer<typeof exportedAccountSchema>;
export type RawStatsExport = z.infer<typeof rawStatsExportSchema>;
export type ExportedSession = z.infer<typeof exportedSessionSchema>;
export type ExportedBattle = z.infer<typeof exportedBattleSchema>;
export type ExportedTankProgress = z.infer<typeof exportedTankProgressSchema>;
export type AnalyticsExport = z.infer<typeof analyticsExportSchema>;
