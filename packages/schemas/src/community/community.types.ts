import type { z } from 'zod';

import type { buildSchema, createBuildSchema, loadoutSchema, visibilitySchema } from './community.schemas';

export type Loadout = z.infer<typeof loadoutSchema>;
export type Visibility = z.infer<typeof visibilitySchema>;
export type Build = z.infer<typeof buildSchema>;
export type CreateBuildInput = z.infer<typeof createBuildSchema>;
