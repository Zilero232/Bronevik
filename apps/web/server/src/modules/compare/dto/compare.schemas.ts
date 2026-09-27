import { playerComparisonQuerySchema, tankComparisonQuerySchema } from '@otmetki/schemas';
import { z } from 'zod';

const playerIds = playerComparisonQuerySchema.shape.accountIds;
const tankIds = tankComparisonQuerySchema.shape.tankIds;

export const comparePlayersQuerySchema = z
  .object({
    ids: playerIds.optional(),
    accountIds: playerIds.optional()
  })
  .refine(({ ids, accountIds }) => (accountIds ?? ids) !== undefined, { message: 'Pass ids or accountIds', path: ['ids'] });

export const compareTanksQuerySchema = z
  .object({
    ids: tankIds.optional(),
    tankIds: tankIds.optional(),
    profiles: tankComparisonQuerySchema.shape.profiles
  })
  .refine(({ ids, tankIds: explicit }) => (explicit ?? ids) !== undefined, { message: 'Pass ids or tankIds', path: ['ids'] });
