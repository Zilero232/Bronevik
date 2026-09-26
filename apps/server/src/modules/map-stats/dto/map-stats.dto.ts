import { createZodDto } from 'nestjs-zod';

import { mapQueueSchema, mapRotationSchema, mapStatsQuerySchema } from './map-stats.schemas';

export class MapRotationDto extends createZodDto(mapRotationSchema) {}

export class MapQueueDto extends createZodDto(mapQueueSchema) {}

export class MapStatsQueryDto extends createZodDto(mapStatsQuerySchema) {}
