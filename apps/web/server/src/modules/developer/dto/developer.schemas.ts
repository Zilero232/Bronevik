import { uuidSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const developerIdParamsSchema = z.object({ id: uuidSchema });
