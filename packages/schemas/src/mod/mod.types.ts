import type { z } from 'zod';

import type {
  bindCodeInputSchema,
  bindCodeSchema,
  modBattleLoadoutSchema,
  modDeviceSchema,
  modDevicesSchema,
  modErrorCodeSchema,
  modGoalSchema,
  modGoalsRequestSchema,
  modGoalsSchema,
  modOverallRatingsSchema,
  modOverviewSchema,
  modRatingsRequestSchema,
  modReplayHighlightsSchema,
  modReplayStatusesSchema,
  modReplayStatusRequestSchema,
  modReplayStatusSchema,
  modSessionRatingsSchema,
  modSessionSharePreferenceAnswerSchema,
  modSessionSharePreferenceSchema,
  modSessionShareSendSchema,
  modSessionShareSentSchema,
  modShareChannelSchema,
  modTankExpectedSchema,
  modTankRatingSchema,
  modTankRatingsRequestSchema,
  modTankRatingsSchema,
  modTankRecordsSchema
} from './mod.schemas';

export type BindCodeInput = z.infer<typeof bindCodeInputSchema>;
export type BindCode = z.infer<typeof bindCodeSchema>;
export type ModDevice = z.infer<typeof modDeviceSchema>;
export type ModDevices = z.infer<typeof modDevicesSchema>;
export type ModBattleLoadout = z.infer<typeof modBattleLoadoutSchema>;
export type ModErrorCode = z.infer<typeof modErrorCodeSchema>;
export type ModRatingsRequest = z.infer<typeof modRatingsRequestSchema>;
export type ModTankRatingsRequest = z.infer<typeof modTankRatingsRequestSchema>;
export type ModOverallRatings = z.infer<typeof modOverallRatingsSchema>;
export type ModSessionRatings = z.infer<typeof modSessionRatingsSchema>;
export type ModOverview = z.infer<typeof modOverviewSchema>;
export type ModTankRating = z.infer<typeof modTankRatingSchema>;
export type ModTankRatings = z.infer<typeof modTankRatingsSchema>;
export type ModTankRecords = z.infer<typeof modTankRecordsSchema>;
export type ModTankExpected = z.infer<typeof modTankExpectedSchema>;
export type ModGoalsRequest = z.infer<typeof modGoalsRequestSchema>;
export type ModGoal = z.infer<typeof modGoalSchema>;
export type ModGoals = z.infer<typeof modGoalsSchema>;
export type ModReplayStatusRequest = z.infer<typeof modReplayStatusRequestSchema>;
export type ModReplayHighlights = z.infer<typeof modReplayHighlightsSchema>;
export type ModReplayStatus = z.infer<typeof modReplayStatusSchema>;
export type ModReplayStatuses = z.infer<typeof modReplayStatusesSchema>;
export type ModShareChannel = z.infer<typeof modShareChannelSchema>;
export type ModSessionSharePreference = z.infer<typeof modSessionSharePreferenceSchema>;
export type ModSessionSharePreferenceAnswer = z.infer<typeof modSessionSharePreferenceAnswerSchema>;
export type ModSessionShareSend = z.infer<typeof modSessionShareSendSchema>;
export type ModSessionShareSent = z.infer<typeof modSessionShareSentSchema>;
