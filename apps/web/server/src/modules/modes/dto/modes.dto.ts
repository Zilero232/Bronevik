import { modeMetaQuerySchema, modeMetaSchema, modeParamsSchema, modesHubSchema, myModeStatsQuerySchema, myModeStatsSchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

export class ModesHubDto extends createZodDto(modesHubSchema) {}
export class ModeMetaDto extends createZodDto(modeMetaSchema) {}
export class ModeMetaQueryDto extends createZodDto(modeMetaQuerySchema) {}
export class ModeParamsDto extends createZodDto(modeParamsSchema) {}
export class MyModeStatsDto extends createZodDto(myModeStatsSchema) {}
export class MyModeStatsQueryDto extends createZodDto(myModeStatsQuerySchema) {}
