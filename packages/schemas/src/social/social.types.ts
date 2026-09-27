import type { z } from 'zod';

import type { leagueMetricSchema, leagueScopeSchema, leagueTierSchema, leagueZoneSchema, weeklyChallengeMetricSchema } from './social.schemas';

export type LeagueTier = z.infer<typeof leagueTierSchema>;
export type LeagueZone = z.infer<typeof leagueZoneSchema>;
export type LeagueScope = z.infer<typeof leagueScopeSchema>;
export type LeagueMetric = z.infer<typeof leagueMetricSchema>;
export type WeeklyChallengeMetric = z.infer<typeof weeklyChallengeMetricSchema>;
