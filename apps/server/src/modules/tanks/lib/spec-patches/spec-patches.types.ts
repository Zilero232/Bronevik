import type { TankPatchChange } from '@otmetki/schemas';
import type { z } from 'zod';

import type { specChangesSchema } from './spec-patches.schemas';

export type SpecChange = z.infer<typeof specChangesSchema>[number];

export type ChangeEffect = TankPatchChange['effect'];

export type PatchVerdictInput = {
  changes: readonly TankPatchChange[];
  isFirst: boolean;
};
