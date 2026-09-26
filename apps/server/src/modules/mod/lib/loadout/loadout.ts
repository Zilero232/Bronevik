import type { StoredLoadout } from './loadout.types';

import { storedLoadoutSchema } from './loadout.schemas';

export const readStoredLoadout = (value: unknown): StoredLoadout | null => {
  const parsed = storedLoadoutSchema.safeParse(value);

  return parsed.success ? parsed.data : null;
};
