import type { z } from 'zod';

import type { componentStateSchema, installationSchema, installedComponentSchema } from './installation.schemas';

export type ComponentState = z.infer<typeof componentStateSchema>;

export type InstalledComponent = z.infer<typeof installedComponentSchema>;

export type Installation = z.infer<typeof installationSchema>;

export type SetComponentEnabledInput = {
  clientPath: string | null;
  componentId: string;
  enabled: boolean;
};
