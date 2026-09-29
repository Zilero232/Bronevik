import { clanIdSchema, tankIdSchema } from '@otmetki/schemas';
import { z } from 'zod';

export const v1TankParamsSchema = z.object({ id: tankIdSchema });

export const v1ClanParamsSchema = z.object({ id: clanIdSchema });
