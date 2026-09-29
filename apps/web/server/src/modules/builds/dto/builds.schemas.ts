import { tankIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const buildTankParamsSchema = z.object({ id: tankIdSchema });
