import {
  analyticsExportSchema,
  createFavoriteSchema,
  createGoalSchema,
  favoriteSchema,
  favoritesSchema,
  goalSchema,
  goalsSchema,
  linkedAccountsSchema,
  modGoalsRequestSchema,
  modGoalsSchema,
  notificationSettingsSchema,
  playerMarksSchema,
  rawStatsExportSchema,
  updateGoalSchema,
  updateNotificationSettingsSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { idParamsSchema, lestaAccountParamsSchema } from './me.schemas';

export class FavoriteDto extends createZodDto(favoriteSchema) {}
export class FavoritesDto extends createZodDto(favoritesSchema) {}
export class CreateFavoriteDto extends createZodDto(createFavoriteSchema) {}
export class GoalDto extends createZodDto(goalSchema) {}
export class GoalsDto extends createZodDto(goalsSchema) {}
export class CreateGoalDto extends createZodDto(createGoalSchema) {}
export class UpdateGoalDto extends createZodDto(updateGoalSchema) {}
export class IdParamsDto extends createZodDto(idParamsSchema) {}
export class LestaAccountParamsDto extends createZodDto(lestaAccountParamsSchema) {}
export class LinkedAccountsDto extends createZodDto(linkedAccountsSchema) {}
export class NotificationSettingsDto extends createZodDto(notificationSettingsSchema) {}
export class UpdateNotificationSettingsDto extends createZodDto(updateNotificationSettingsSchema) {}
export class MyMarksDto extends createZodDto(playerMarksSchema) {}
export class RawStatsExportDto extends createZodDto(rawStatsExportSchema) {}
export class AnalyticsExportDto extends createZodDto(analyticsExportSchema) {}
export class ModGoalsRequestDto extends createZodDto(modGoalsRequestSchema) {}
export class ModGoalsDto extends createZodDto(modGoalsSchema) {}
