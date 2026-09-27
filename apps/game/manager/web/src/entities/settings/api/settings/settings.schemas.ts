import { z } from 'zod';

import { SETTINGS } from '../../config';

export const managerSettingsSchema = z.object({
  autostart: z.boolean(),
  notifications: z.boolean(),
  autoMigrate: z.boolean(),
  checkIntervalMinutes: z.number().int(),
  language: z.enum(SETTINGS.languages),
  selectedClient: z.string().nullable(),
  manualClients: z.array(z.string())
});
