import type { z } from 'zod';

import type { replayMasterySchema, replayPlayerSchema, replayStatusSchema, replaySummarySchema, replayTagSchema } from './replays.schemas';

export type ReplayStatus = z.infer<typeof replayStatusSchema>;
export type ReplayPlayer = z.infer<typeof replayPlayerSchema>;
export type ReplaySummary = z.infer<typeof replaySummarySchema>;
export type ReplayTag = z.infer<typeof replayTagSchema>;
export type ReplayMastery = z.infer<typeof replayMasterySchema>;
