import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { ManagerSettings } from './settings.types';

import { managerSettingsSchema } from './settings.schemas';

export const getSettings = () => invokeCommand({ command: COMMANDS.getSettings, schema: managerSettingsSchema });

export const updateSettings = (settings: ManagerSettings) =>
  invokeCommand({ command: COMMANDS.updateSettings, schema: managerSettingsSchema, args: { settings } });
