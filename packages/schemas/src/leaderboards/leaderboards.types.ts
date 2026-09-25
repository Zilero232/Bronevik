import type { z } from 'zod';

import type { leaderboardEntrySchema, leaderboardQuerySchema, leaderboardSchema, leaderboardScopeSchema } from './leaderboards.schemas';

export type LeaderboardScope = z.infer<typeof leaderboardScopeSchema>;
export type LeaderboardQuery = z.infer<typeof leaderboardQuerySchema>;
export type LeaderboardEntry = z.infer<typeof leaderboardEntrySchema>;
export type Leaderboard = z.infer<typeof leaderboardSchema>;
