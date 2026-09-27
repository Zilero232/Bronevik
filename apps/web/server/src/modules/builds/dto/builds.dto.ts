import {
  buildHistorySchema,
  buildOptionsSchema,
  buildsCatalogQuerySchema,
  buildsCatalogSchema,
  buildUsageQuerySchema,
  loadoutRequestSchema,
  loadoutResultSchema,
  popularBuildsQuerySchema,
  popularBuildsSchema,
  recommendedBuildSchema,
  tankIdSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class BuildTankParamsDto extends createZodDto(z.object({ id: tankIdSchema })) {}
export class BuildOptionsDto extends createZodDto(buildOptionsSchema) {}
export class LoadoutRequestDto extends createZodDto(loadoutRequestSchema) {}
export class LoadoutResultDto extends createZodDto(loadoutResultSchema) {}
export class PopularBuildsQueryDto extends createZodDto(popularBuildsQuerySchema) {}
export class PopularBuildsDto extends createZodDto(popularBuildsSchema) {}
export class BuildUsageQueryDto extends createZodDto(buildUsageQuerySchema) {}
export class RecommendedBuildDto extends createZodDto(recommendedBuildSchema) {}
export class BuildHistoryDto extends createZodDto(buildHistorySchema) {}
export class BuildsCatalogQueryDto extends createZodDto(buildsCatalogQuerySchema) {}
export class BuildsCatalogDto extends createZodDto(buildsCatalogSchema) {}
