import { accountIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const officialPlayerParamsSchema = z.object({ id: accountIdSchema });
