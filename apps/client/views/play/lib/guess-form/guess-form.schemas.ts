import type { VehicleSummary } from '@otmetki/schemas';

import { z } from 'zod';

export const guessFormSchema = z.object({
  pick: z.custom<VehicleSummary>().nullable()
});
