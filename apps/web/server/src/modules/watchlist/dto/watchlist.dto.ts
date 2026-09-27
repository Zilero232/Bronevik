import {
  addWatchlistPlayerSchema,
  updateWatchlistSettingsSchema,
  watchlistPlayerParamsSchema,
  watchlistQuerySchema,
  watchlistSchema,
  watchlistSettingsSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class WatchlistDto extends createZodDto(watchlistSchema) {}
export class WatchlistQueryDto extends createZodDto(watchlistQuerySchema) {}
export class AddWatchlistPlayerDto extends createZodDto(addWatchlistPlayerSchema) {}
export class WatchlistPlayerParamsDto extends createZodDto(watchlistPlayerParamsSchema) {}
export class UpdateWatchlistSettingsDto extends createZodDto(updateWatchlistSettingsSchema) {}
export class WatchlistSettingsDto extends createZodDto(watchlistSettingsSchema) {}
