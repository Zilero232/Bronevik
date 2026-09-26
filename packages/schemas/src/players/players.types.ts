import type { z } from 'zod';

import type {
  activityDaySchema,
  activityQuerySchema,
  activitySchema,
  groupInsightSchema,
  insightsPeriodSchema,
  insightsQuerySchema,
  insightTipCodeSchema,
  moeThresholdValuesSchema,
  nicknameHistorySchema,
  playerAchievementSchema,
  playerAchievementsSchema,
  playerClanSchema,
  playerHistoryEntrySchema,
  playerInsightsSchema,
  playerMarkRowSchema,
  playerMarksSchema,
  playerProfileSchema,
  playerSummarySchema,
  playerTankRowSchema,
  playerTankSortFieldSchema,
  playerTanksPageSchema,
  playerTanksQuerySchema,
  playtimeCellSchema,
  playtimeSchema,
  popularPlayerSchema,
  popularPlayersQuerySchema,
  popularPlayersSchema,
  recentPeriodsSchema,
  recentPeriodStatsSchema,
  tankInsightSchema,
  timeSeriesGranularitySchema,
  timeSeriesMarkerSchema,
  timeSeriesMetricSchema,
  timeSeriesPointSchema,
  timeSeriesQuerySchema,
  timeSeriesSchema
} from './players.schemas';

export type ActivityDay = z.infer<typeof activityDaySchema>;
export type ActivityQuery = z.infer<typeof activityQuerySchema>;
export type PlayerActivity = z.infer<typeof activitySchema>;
export type GroupInsight = z.infer<typeof groupInsightSchema>;
export type TankInsight = z.infer<typeof tankInsightSchema>;
export type InsightsPeriod = z.infer<typeof insightsPeriodSchema>;
export type InsightsQuery = z.infer<typeof insightsQuerySchema>;
export type InsightTipCode = z.infer<typeof insightTipCodeSchema>;
export type MoeThresholdValues = z.infer<typeof moeThresholdValuesSchema>;
export type NicknameHistory = z.infer<typeof nicknameHistorySchema>;
export type PlayerClan = z.infer<typeof playerClanSchema>;
export type PlayerHistoryEntry = z.infer<typeof playerHistoryEntrySchema>;
export type PlayerInsights = z.infer<typeof playerInsightsSchema>;
export type PlayerMarkRow = z.infer<typeof playerMarkRowSchema>;
export type PlayerMarks = z.infer<typeof playerMarksSchema>;
export type PlayerProfile = z.infer<typeof playerProfileSchema>;
export type PlayerSummary = z.infer<typeof playerSummarySchema>;
export type PlayerTankRow = z.infer<typeof playerTankRowSchema>;
export type PlayerTankSortField = z.infer<typeof playerTankSortFieldSchema>;
export type PlayerTanksPage = z.infer<typeof playerTanksPageSchema>;
export type PlayerTanksQuery = z.output<typeof playerTanksQuerySchema>;
export type PlaytimeCell = z.infer<typeof playtimeCellSchema>;
export type Playtime = z.infer<typeof playtimeSchema>;
export type PopularPlayer = z.infer<typeof popularPlayerSchema>;
export type PopularPlayersQuery = z.infer<typeof popularPlayersQuerySchema>;
export type PopularPlayers = z.infer<typeof popularPlayersSchema>;
export type RecentPeriods = z.infer<typeof recentPeriodsSchema>;
export type RecentPeriodStats = z.infer<typeof recentPeriodStatsSchema>;
export type TimeSeriesGranularity = z.infer<typeof timeSeriesGranularitySchema>;
export type TimeSeriesMarker = z.infer<typeof timeSeriesMarkerSchema>;
export type TimeSeriesMetric = z.infer<typeof timeSeriesMetricSchema>;
export type TimeSeriesPoint = z.infer<typeof timeSeriesPointSchema>;
export type TimeSeriesQuery = z.infer<typeof timeSeriesQuerySchema>;
export type TimeSeries = z.infer<typeof timeSeriesSchema>;
export type PlayerAchievement = z.infer<typeof playerAchievementSchema>;
export type PlayerAchievements = z.infer<typeof playerAchievementsSchema>;
