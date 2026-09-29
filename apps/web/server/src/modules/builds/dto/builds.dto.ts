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
  recommendedBuildSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { buildTankParamsSchema } from './builds.schemas';

export class BuildTankParamsDto extends createZodDto(buildTankParamsSchema) {}
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
