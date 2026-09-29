import {
  apiErrorSchema,
  clanEventsPageSchema,
  clanListPageSchema,
  clanListQuerySchema,
  clanMembersSchema,
  clanPageSchema,
  leaderboardQuerySchema,
  leaderboardSchema,
  moeHistoryBatchQuerySchema,
  moeHistoryBatchSchema,
  moeHistoryFiltersSchema,
  moeHistorySchema,
  moePageSchema,
  moeQuerySchema,
  paginationQuerySchema,
  playerMarksSchema,
  playerProfileSchema,
  playerTanksPageSchema,
  playerTanksQuerySchema,
  recentPeriodsSchema,
  sessionSchema,
  sessionsPageSchema,
  tankDetailQuerySchema,
  tankDetailSchema,
  tankServerStatsQuerySchema,
  tankStatsPageSchema,
  tierListQuerySchema,
  tierListSchema,
  timeSeriesQuerySchema,
  timeSeriesSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { playerLookupParamsSchema, playerParamsSchema, sessionParamsSchema } from '../../players';
import { v1ClanParamsSchema, v1TankParamsSchema } from './v1.schemas';

export class V1PlayerLookupDto extends createZodDto(playerLookupParamsSchema) {}
export class V1PlayerParamsDto extends createZodDto(playerParamsSchema) {}
export class V1SessionParamsDto extends createZodDto(sessionParamsSchema) {}
export class V1TankParamsDto extends createZodDto(v1TankParamsSchema) {}
export class V1ClanParamsDto extends createZodDto(v1ClanParamsSchema) {}
export class V1RecentPeriodsDto extends createZodDto(recentPeriodsSchema) {}
export class V1PlayerMarksDto extends createZodDto(playerMarksSchema) {}
export class V1LeaderboardQueryDto extends createZodDto(leaderboardQuerySchema) {}
export class V1LeaderboardDto extends createZodDto(leaderboardSchema) {}
export class V1PlayerProfileDto extends createZodDto(playerProfileSchema) {}
export class V1PlayerTanksQueryDto extends createZodDto(playerTanksQuerySchema) {}
export class V1PlayerTanksPageDto extends createZodDto(playerTanksPageSchema) {}
export class V1TimeSeriesQueryDto extends createZodDto(timeSeriesQuerySchema) {}
export class V1TimeSeriesDto extends createZodDto(timeSeriesSchema) {}
export class V1SessionsQueryDto extends createZodDto(paginationQuerySchema) {}
export class V1SessionsPageDto extends createZodDto(sessionsPageSchema) {}
export class V1SessionDto extends createZodDto(sessionSchema) {}
export class V1TankStatsQueryDto extends createZodDto(tankServerStatsQuerySchema) {}
export class V1TankStatsPageDto extends createZodDto(tankStatsPageSchema) {}
export class V1TierListQueryDto extends createZodDto(tierListQuerySchema) {}
export class V1TierListDto extends createZodDto(tierListSchema) {}
export class V1TankDetailQueryDto extends createZodDto(tankDetailQuerySchema) {}
export class V1TankDetailDto extends createZodDto(tankDetailSchema) {}
export class V1MoeQueryDto extends createZodDto(moeQuerySchema) {}
export class V1MoePageDto extends createZodDto(moePageSchema) {}
export class V1MoeHistoryFiltersDto extends createZodDto(moeHistoryFiltersSchema) {}
export class V1MoeHistoryDto extends createZodDto(moeHistorySchema) {}
export class V1MoeHistoryBatchQueryDto extends createZodDto(moeHistoryBatchQuerySchema) {}
export class V1MoeHistoryBatchDto extends createZodDto(moeHistoryBatchSchema) {}
export class V1ClanListQueryDto extends createZodDto(clanListQuerySchema) {}
export class V1ClanListPageDto extends createZodDto(clanListPageSchema) {}
export class V1ClanPageDto extends createZodDto(clanPageSchema) {}
export class V1ClanMembersDto extends createZodDto(clanMembersSchema) {}
export class V1ClanEventsQueryDto extends createZodDto(paginationQuerySchema) {}
export class V1ClanEventsPageDto extends createZodDto(clanEventsPageSchema) {}
export class V1ApiErrorDto extends createZodDto(apiErrorSchema) {}
