import { mapDetailSchema, mapListSchema, mapParamsSchema, mapsQuerySchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class MapsQueryDto extends createZodDto(mapsQuerySchema) {}
export class MapParamsDto extends createZodDto(mapParamsSchema) {}
export class MapListDto extends createZodDto(mapListSchema) {}
export class MapDetailDto extends createZodDto(mapDetailSchema) {}
