import type { z } from 'zod';

import type { ratingPeriodSchema, recentPeriodSchema, serverPeriodSchema, skillCohortSchema, statsModeSchema } from './period.schemas';

export type RecentPeriod = z.infer<typeof recentPeriodSchema>;
export type RatingPeriod = z.infer<typeof ratingPeriodSchema>;
export type ServerPeriod = z.infer<typeof serverPeriodSchema>;
export type StatsMode = z.infer<typeof statsModeSchema>;
export type SkillCohort = z.infer<typeof skillCohortSchema>;
