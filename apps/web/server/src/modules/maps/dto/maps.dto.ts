import {
  mapDetailSchema,
  mapListSchema,
  mapParamsSchema,
  mapsQuerySchema,
  mapTanksSchema,
  tankMapParamsSchema,
  tankMapsSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class MapsQueryDto extends createZodDto(mapsQuerySchema) {}
export class MapParamsDto extends createZodDto(mapParamsSchema) {}
export class MapListDto extends createZodDto(mapListSchema) {}
export class MapDetailDto extends createZodDto(mapDetailSchema) {}
export class MapTanksDto extends createZodDto(mapTanksSchema) {}
export class TankMapParamsDto extends createZodDto(tankMapParamsSchema) {}
export class TankMapsDto extends createZodDto(tankMapsSchema) {}
