import type { RatingPeriod, ServerPeriod, SkillCohort, StatsMode } from '@otmetki/schemas';

import { invert } from 'remeda';

import type {
  ClanRole as DbClanRole,
  CohortFilter as DbCohortFilter,
  NotificationChannel as DbNotificationChannel,
  NotificationEvent as DbNotificationEvent,
  RatingPeriod as DbRatingPeriod,
  ServerStatsPeriod as DbServerPeriod,
  StatsMode as DbStatsMode,
  VehicleType as DbVehicleType
} from '../../../../generated';

export const RATING_PERIOD_TO_DB = {
  overall: 'overall',
  '24h': 'h24',
  '7d': 'd7',
  '30d': 'd30',
  '60d': 'd60',
  '1000': 'b1000'
} as const satisfies Record<RatingPeriod, DbRatingPeriod>;

export const RATING_PERIOD_FROM_DB = invert(RATING_PERIOD_TO_DB) satisfies Record<DbRatingPeriod, RatingPeriod>;

export const SERVER_PERIOD_TO_DB = {
  '1d': 'd1',
  '7d': 'd7',
  '14d': 'd14',
  '30d': 'd30',
  '60d': 'd60'
} as const satisfies Record<ServerPeriod, DbServerPeriod>;

export const SERVER_PERIOD_DAYS = {
  '1d': 1,
  '7d': 7,
  '14d': 14,
  '30d': 30,
  '60d': 60
} as const satisfies Record<ServerPeriod, number>;

export const STATS_MODE_TO_DB = {
  all: 'all',
  random: 'random',
  ranked: 'ranked',
  epic: 'epic',
  clan: 'clan',
  stronghold: 'strongholdSkirmish'
} as const satisfies Record<StatsMode, DbStatsMode>;

export const COHORT_TO_DB = {
  all: 'all',
  beginner: 'beginner',
  average: 'average',
  good: 'good',
  elite: 'elite'
} as const satisfies Record<SkillCohort, DbCohortFilter>;

export const VEHICLE_TYPE_FROM_DB = {
  lightTank: 'lightTank',
  mediumTank: 'mediumTank',
  heavyTank: 'heavyTank',
  atSpg: 'AT-SPG',
  spg: 'SPG'
} as const satisfies Record<DbVehicleType, string>;

export const VEHICLE_TYPE_TO_DB = invert(VEHICLE_TYPE_FROM_DB) satisfies Record<string, DbVehicleType>;

export const CLAN_ROLE_FROM_DB = {
  commander: 'commander',
  executiveOfficer: 'executive_officer',
  personnelOfficer: 'personnel_officer',
  combatOfficer: 'combat_officer',
  intelligenceOfficer: 'intelligence_officer',
  quartermaster: 'quartermaster',
  recruitmentOfficer: 'recruitment_officer',
  juniorOfficer: 'junior_officer',
  private: 'private',
  recruit: 'recruit',
  reservist: 'reservist'
} as const satisfies Record<DbClanRole, string>;

export const NOTIFICATION_EVENT_FROM_DB = {
  moeGained: 'moe_gained',
  moeThresholdDropped: 'moe_threshold_dropped',
  masteryGained: 'mastery_gained',
  sessionFinished: 'session_finished',
  clanRosterChanged: 'clan_roster_changed',
  clanEventReminder: 'clan_event_reminder',
  clanWeeklyReport: 'clan_weekly_report',
  bonusCode: 'bonus_code',
  premiumOffer: 'premium_offer',
  tankChanged: 'tank_changed',
  goalReached: 'goal_reached',
  badgeAwarded: 'badge_awarded',
  challengeResolved: 'challenge_resolved',
  watchlistDigest: 'watchlist_digest',
  tankReturned: 'tank_returned',
  competitionFinished: 'competition_finished',
  firstWinAvailable: 'first_win_available',
  replayOverflow: 'replay_overflow',
  streamerLive: 'streamer_live',
  tankLevelUp: 'tank_level_up',
  tankChallengeDone: 'tank_challenge_done',
  plusCheckoutOpen: 'plus_checkout_open',
  lestaRelinkRequired: 'lesta_relink_required'
} as const satisfies Record<DbNotificationEvent, string>;

export const NOTIFICATION_CHANNEL_FROM_DB = {
  telegram: 'telegram',
  email: 'email',
  webPush: 'web_push',
  site: 'site'
} as const satisfies Record<DbNotificationChannel, string>;

export const RATING_PERIOD_SQL = {
  overall: 'overall',
  '24h': '24h',
  '7d': '7d',
  '30d': '30d',
  '60d': '60d',
  '1000': '1000b'
} as const satisfies Record<RatingPeriod, string>;

export const STATS_MODE_SQL = {
  all: 'all',
  random: 'random',
  ranked: 'ranked',
  epic: 'epic',
  clan: 'clan',
  stronghold: 'stronghold_skirmish'
} as const satisfies Record<StatsMode, string>;
