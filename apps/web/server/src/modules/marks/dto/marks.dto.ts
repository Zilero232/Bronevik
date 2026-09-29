import {
  moeCurveParamsSchema,
  moeCurveSchema,
  moeHistoryBatchQuerySchema,
  moeHistoryBatchSchema,
  moeHistoryFiltersSchema,
  moeHistorySchema,
  moePageSchema,
  moeProjectionSchema,
  moeQuerySchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { modMoeParamsSchema, modMoeThresholdsSchema, moeHistoryParamsSchema } from './marks.schemas';

export class MoeQueryDto extends createZodDto(moeQuerySchema) {}
export class MoePageDto extends createZodDto(moePageSchema) {}
export class MoeHistoryParamsDto extends createZodDto(moeHistoryParamsSchema) {}
export class MoeHistoryFiltersDto extends createZodDto(moeHistoryFiltersSchema) {}
export class MoeHistoryDto extends createZodDto(moeHistorySchema) {}
export class MoeHistoryBatchQueryDto extends createZodDto(moeHistoryBatchQuerySchema) {}
export class MoeHistoryBatchDto extends createZodDto(moeHistoryBatchSchema) {}
export class MoeProjectionInputDto extends createZodDto(moeProjectionSchema.omit({ battlesNeeded: true })) {}
export class MoeProjectionDto extends createZodDto(moeProjectionSchema) {}
export class ModMoeParamsDto extends createZodDto(modMoeParamsSchema) {}
export class ModMoeThresholdsDto extends createZodDto(modMoeThresholdsSchema) {}
export class MoeCurveParamsDto extends createZodDto(moeCurveParamsSchema) {}
export class MoeCurveDto extends createZodDto(moeCurveSchema) {}
