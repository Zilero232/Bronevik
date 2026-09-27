import { managerSettingsSchema } from '@/entities/settings';

export const settingsFormSchema = managerSettingsSchema.pick({
  autostart: true,
  notifications: true,
  autoMigrate: true,
  checkIntervalMinutes: true,
  language: true
});
