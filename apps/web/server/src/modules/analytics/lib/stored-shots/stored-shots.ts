import type { StoredShot } from './stored-shots.types';

import { storedShotSchema } from './stored-shots.schemas';

export const readStoredShots = (value: unknown): StoredShot[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.flatMap((item) => {
    const parsed = storedShotSchema.safeParse(item);

    return parsed.success ? [parsed.data] : [];
  });
};
