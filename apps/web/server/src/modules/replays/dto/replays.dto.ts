import { modReplayStatusesSchema, modReplayStatusRequestSchema, paginationQuerySchema, replaySummarySchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import {
  bestOfWeekQuerySchema,
  bestOfWeekSchema,
  heatmapParamsSchema,
  heatmapQuerySchema,
  heatmapSchema,
  replayIdParamsSchema,
  replayPageSchema,
  replaySearchQuerySchema,
  replayTracksSchema,
  replayVersionsSchema,
  updateReplaySchema,
  uploadedReplaySchema,
  uploadReplaySchema
} from './replays.schemas';

export class ReplayDto extends createZodDto(replaySummarySchema) {}
export class ReplayPageDto extends createZodDto(replayPageSchema) {}
export class ReplaySearchQueryDto extends createZodDto(replaySearchQuerySchema) {}
export class ReplayIdParamsDto extends createZodDto(replayIdParamsSchema) {}
export class UploadReplayDto extends createZodDto(uploadReplaySchema) {}
export class UpdateReplayDto extends createZodDto(updateReplaySchema) {}
export class UploadedReplayDto extends createZodDto(uploadedReplaySchema) {}
export class BestOfWeekQueryDto extends createZodDto(bestOfWeekQuerySchema) {}
export class BestOfWeekDto extends createZodDto(bestOfWeekSchema) {}
export class HeatmapParamsDto extends createZodDto(heatmapParamsSchema) {}
export class HeatmapQueryDto extends createZodDto(heatmapQuerySchema) {}
export class HeatmapDto extends createZodDto(heatmapSchema) {}
export class ReplayTracksDto extends createZodDto(replayTracksSchema) {}
export class ReplayVersionsDto extends createZodDto(replayVersionsSchema) {}
export class PaginationQueryDto extends createZodDto(paginationQuerySchema) {}
export class ModReplayStatusRequestDto extends createZodDto(modReplayStatusRequestSchema) {}
export class ModReplayStatusesDto extends createZodDto(modReplayStatusesSchema) {}
