import { z } from 'zod';

export const storedFilterSchema = z
  .object({
    accountIds: z.array(z.number()).catch([]).default([]),
    clanIds: z.array(z.number()).catch([]).default([])
  })
  .catch({ accountIds: [], clanIds: [] });
