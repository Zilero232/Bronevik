import { gameEventSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const gameEventListSchema = z.array(gameEventSchema);
