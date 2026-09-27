import { createZodDto } from 'nestjs-zod';

import { supertestAnnouncementSchema, supertestListSchema, supertestMineSchema, supertestParamsSchema } from './supertest.schemas';

export class SupertestAnnouncementDto extends createZodDto(supertestAnnouncementSchema) {}

export class SupertestListDto extends createZodDto(supertestListSchema) {}

export class SupertestMineDto extends createZodDto(supertestMineSchema) {}

export class SupertestParamsDto extends createZodDto(supertestParamsSchema) {}
