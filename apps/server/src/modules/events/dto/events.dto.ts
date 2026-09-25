import { gameEventSchema, gameEventsQuerySchema } from '@bronevik/schemas';
import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

export class GameEventsQueryDto extends createZodDto(gameEventsQuerySchema) {}
export class GameEventListDto extends createZodDto(z.array(gameEventSchema)) {}
