import type { z } from 'zod';

import type {
  accountAchievementsSchema,
  accountInfoSchema,
  accountListItemSchema,
  accountStatisticsSchema,
  accountTankSchema
} from './account.schemas';

export type AccountListItem = z.infer<typeof accountListItemSchema>;
export type AccountStatistics = z.infer<typeof accountStatisticsSchema>;
export type AccountInfo = z.infer<typeof accountInfoSchema>;
export type AccountTank = z.infer<typeof accountTankSchema>;
export type AccountAchievements = z.infer<typeof accountAchievementsSchema>;
