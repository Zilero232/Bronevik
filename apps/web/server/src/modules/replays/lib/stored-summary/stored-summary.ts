import type { ReplaySummary } from '../../../../lib/replay';

import { replaySummarySchema } from '../../../../lib/replay';

export const readStoredSummary = (value: unknown): ReplaySummary | null => {
  const parsed = replaySummarySchema.safeParse(value);

  return parsed.success ? parsed.data : null;
};
