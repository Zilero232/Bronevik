import type { z } from 'zod';

import type {
  seasonHistoryEntrySchema,
  seasonHistorySchema,
  seasonRewardSchema,
  seasonSchema,
  seasonTrackSchema,
  shellEntrySchema,
  shellReasonSchema,
  shellsSchema,
  tankChallengeMetricSchema,
  tankChallengeSchema,
  tankChallengeSetSchema,
  tankChallengesSchema,
  tankProgressListSchema,
  tankProgressSchema
} from './progression.schemas';

export type TankChallengeMetric = z.infer<typeof tankChallengeMetricSchema>;
export type TankProgress = z.infer<typeof tankProgressSchema>;
export type TankProgressList = z.infer<typeof tankProgressListSchema>;
export type TankChallenge = z.infer<typeof tankChallengeSchema>;
export type TankChallengeSet = z.infer<typeof tankChallengeSetSchema>;
export type TankChallenges = z.infer<typeof tankChallengesSchema>;
export type ShellReason = z.infer<typeof shellReasonSchema>;
export type ShellEntry = z.infer<typeof shellEntrySchema>;
export type Shells = z.infer<typeof shellsSchema>;
export type Season = z.infer<typeof seasonSchema>;
export type SeasonReward = z.infer<typeof seasonRewardSchema>;
export type SeasonTrack = z.infer<typeof seasonTrackSchema>;
export type SeasonHistoryEntry = z.infer<typeof seasonHistoryEntrySchema>;
export type SeasonHistory = z.infer<typeof seasonHistorySchema>;

export type TankLevel = {
  level: number;
  levelXp: number;
  nextLevelXp: number | null;
};

export type SeasonLevel = {
  level: number;
  levelPoints: number;
  nextLevelPoints: number | null;
};

export type SeasonWindow = {
  code: string;
  startsAt: Date;
  endsAt: Date;
};
