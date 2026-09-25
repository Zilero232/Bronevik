import {
  tankDetailQuerySchema,
  tankDetailSchema,
  tankPatchesSchema,
  tankServerStatsQuerySchema,
  tankStatsPageSchema,
  tankTrendQuerySchema,
  tankTrendSchema,
  tierListQuerySchema,
  tierListSchema,
  topPlayersQuerySchema,
  topPlayersSchema,
  vehicleCatalogSchema,
  vehicleFilterSchema
} from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';

import { tankLookupParamsSchema, tankParamsSchema } from './tanks.schemas';

export class TankStatsQueryDto extends createZodDto(tankServerStatsQuerySchema) {}
export class TankStatsPageDto extends createZodDto(tankStatsPageSchema) {}
export class TierListQueryDto extends createZodDto(tierListQuerySchema) {}
export class TierListDto extends createZodDto(tierListSchema) {}
export class TankLookupParamsDto extends createZodDto(tankLookupParamsSchema) {}
export class TankParamsDto extends createZodDto(tankParamsSchema) {}
export class TankDetailQueryDto extends createZodDto(tankDetailQuerySchema) {}
export class TankDetailDto extends createZodDto(tankDetailSchema) {}
export class TopPlayersQueryDto extends createZodDto(topPlayersQuerySchema) {}
export class TopPlayersDto extends createZodDto(topPlayersSchema) {}
export class TankTrendQueryDto extends createZodDto(tankTrendQuerySchema) {}
export class TankTrendDto extends createZodDto(tankTrendSchema) {}
export class TankPatchesDto extends createZodDto(tankPatchesSchema) {}
export class VehicleFilterDto extends createZodDto(vehicleFilterSchema) {}
export class VehicleCatalogDto extends createZodDto(vehicleCatalogSchema) {}
