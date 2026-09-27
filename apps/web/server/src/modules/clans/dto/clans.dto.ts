import {
  clanEventsPageSchema,
  clanListPageSchema,
  clanListQuerySchema,
  clanMembersSchema,
  clanPageSchema,
  clanStrongholdSchema,
  paginationQuerySchema
} from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { clanLookupParamsSchema, clanParamsSchema } from './clans.schemas';

export class ClanLookupParamsDto extends createZodDto(clanLookupParamsSchema) {}
export class ClanParamsDto extends createZodDto(clanParamsSchema) {}
export class ClanPageDto extends createZodDto(clanPageSchema) {}
export class ClanMembersDto extends createZodDto(clanMembersSchema) {}
export class ClanEventsQueryDto extends createZodDto(paginationQuerySchema) {}
export class ClanEventsPageDto extends createZodDto(clanEventsPageSchema) {}
export class ClanListQueryDto extends createZodDto(clanListQuerySchema) {}
export class ClanListPageDto extends createZodDto(clanListPageSchema) {}
export class ClanStrongholdDto extends createZodDto(clanStrongholdSchema) {}
