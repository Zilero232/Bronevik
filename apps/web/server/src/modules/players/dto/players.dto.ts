import {
  activityQuerySchema,
  activitySchema,
  careerModesSchema,
  insightsQuerySchema,
  nicknameHistorySchema,
  paginationQuerySchema,
  playerAchievementsSchema,
  playerCareerSchema,
  playerInsightsSchema,
  playerMarksSchema,
  playerOfficialRatingsSchema,
  playerProfileSchema,
  playerTanksPageSchema,
  playerTanksQuerySchema,
  playtimeSchema,
  popularPlayersQuerySchema,
  popularPlayersSchema,
  sessionSchema,
  sessionsPageSchema,
  timeSeriesQuerySchema,
  timeSeriesSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { playerLookupParamsSchema, playerParamsSchema, sessionParamsSchema } from './players.schemas';

export class PlayerParamsDto extends createZodDto(playerParamsSchema) {}
export class PlayerLookupParamsDto extends createZodDto(playerLookupParamsSchema) {}
export class SessionParamsDto extends createZodDto(sessionParamsSchema) {}

export class PlayerProfileDto extends createZodDto(playerProfileSchema) {}

export class PlayerTanksQueryDto extends createZodDto(playerTanksQuerySchema) {}
export class PlayerTanksPageDto extends createZodDto(playerTanksPageSchema) {}

export class TimeSeriesQueryDto extends createZodDto(timeSeriesQuerySchema) {}
export class TimeSeriesDto extends createZodDto(timeSeriesSchema) {}

export class ActivityQueryDto extends createZodDto(activityQuerySchema) {}
export class ActivityDto extends createZodDto(activitySchema) {}

export class SessionsQueryDto extends createZodDto(paginationQuerySchema) {}
export class SessionsPageDto extends createZodDto(sessionsPageSchema) {}
export class SessionDto extends createZodDto(sessionSchema) {}

export class PlayerMarksDto extends createZodDto(playerMarksSchema) {}

export class InsightsQueryDto extends createZodDto(insightsQuerySchema) {}
export class PlayerInsightsDto extends createZodDto(playerInsightsSchema) {}

export class NicknameHistoryDto extends createZodDto(nicknameHistorySchema) {}

export class PlaytimeDto extends createZodDto(playtimeSchema) {}

export class PopularPlayersQueryDto extends createZodDto(popularPlayersQuerySchema) {}
export class PopularPlayersDto extends createZodDto(popularPlayersSchema) {}

export class PlayerAchievementsDto extends createZodDto(playerAchievementsSchema) {}

export class PlayerCareerDto extends createZodDto(playerCareerSchema) {}
export class PlayerModesDto extends createZodDto(careerModesSchema) {}
export class PlayerOfficialRatingsDto extends createZodDto(playerOfficialRatingsSchema) {}
