import {
  leaderboardQuerySchema,
  leaderboardSchema,
  officialNeighborsQuerySchema,
  officialNeighborsSchema,
  officialRankHistoryQuerySchema,
  officialRankHistorySchema,
  officialTopQuerySchema,
  officialTopSchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { officialPlayerParamsSchema } from './leaderboards.schemas';

export class LeaderboardQueryDto extends createZodDto(leaderboardQuerySchema) {}
export class LeaderboardDto extends createZodDto(leaderboardSchema) {}

export class OfficialTopQueryDto extends createZodDto(officialTopQuerySchema) {}
export class OfficialTopDto extends createZodDto(officialTopSchema) {}
export class OfficialPlayerParamsDto extends createZodDto(officialPlayerParamsSchema) {}
export class OfficialNeighborsQueryDto extends createZodDto(officialNeighborsQuerySchema) {}
export class OfficialNeighborsDto extends createZodDto(officialNeighborsSchema) {}
export class OfficialRankHistoryQueryDto extends createZodDto(officialRankHistoryQuerySchema) {}
export class OfficialRankHistoryDto extends createZodDto(officialRankHistorySchema) {}
