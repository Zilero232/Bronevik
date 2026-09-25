import {
  buildOptionsSchema,
  loadoutRequestSchema,
  loadoutResultSchema,
  popularBuildsQuerySchema,
  popularBuildsSchema,
  tankIdSchema
} from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class BuildTankParamsDto extends createZodDto(z.object({ id: tankIdSchema })) {}
export class BuildOptionsDto extends createZodDto(buildOptionsSchema) {}
export class LoadoutRequestDto extends createZodDto(loadoutRequestSchema) {}
export class LoadoutResultDto extends createZodDto(loadoutResultSchema) {}
export class PopularBuildsQueryDto extends createZodDto(popularBuildsQuerySchema) {}
export class PopularBuildsDto extends createZodDto(popularBuildsSchema) {}
