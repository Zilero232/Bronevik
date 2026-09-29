import type { z } from 'zod';

import type { compareTanksQuerySchema } from './dto/compare.schemas';

export type ComparePlayersInput = {
  accountIds: number[];
};

export type CompareTanksInput = {
  tankIds: number[];
  profiles: z.infer<typeof compareTanksQuerySchema>['profiles'];
};
