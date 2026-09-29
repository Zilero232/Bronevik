import type { z } from 'zod';

import type { rawBuildingSchema } from '../../dto/stronghold.schemas';

export type RawBuilding = z.infer<typeof rawBuildingSchema>;

export type SkirmishStatistics = Record<string, number | null | undefined> | null | undefined;
