import { gameEventsQuerySchema } from '@otmetki/schemas';
import { createZodDto } from 'nestjs-zod';

import { gameEventListSchema } from './events.schemas';

export class GameEventsQueryDto extends createZodDto(gameEventsQuerySchema) {}
export class GameEventListDto extends createZodDto(gameEventListSchema) {}
