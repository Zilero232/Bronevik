import type { ReplaysPage } from '../../model';

import { replaysPageSchema } from '../../model';

export const parseReplaysPage = (page: unknown): ReplaysPage | null => {
  const parsed = replaysPageSchema.safeParse(page);

  return parsed.success ? parsed.data : null;
};
