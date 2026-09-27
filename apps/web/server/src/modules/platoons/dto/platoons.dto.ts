import { createZodDto } from 'nestjs-zod';

import { createPlatoonSchema, platoonPageSchema, platoonPostSchema, platoonQuerySchema } from './platoons.schemas';

export class PlatoonPostDto extends createZodDto(platoonPostSchema) {}
export class PlatoonQueryDto extends createZodDto(platoonQuerySchema) {}
export class PlatoonPageDto extends createZodDto(platoonPageSchema) {}
export class CreatePlatoonDto extends createZodDto(createPlatoonSchema) {}
