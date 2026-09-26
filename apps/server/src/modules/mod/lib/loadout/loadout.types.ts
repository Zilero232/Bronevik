import type { z } from 'zod';

import type { storedLoadoutSchema } from './loadout.schemas';

export type StoredLoadout = z.infer<typeof storedLoadoutSchema>;
