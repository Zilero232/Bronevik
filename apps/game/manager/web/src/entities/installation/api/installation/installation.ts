import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { SetComponentEnabledInput } from './installation.types';

import { installationSchema } from './installation.schemas';

export const getInstallation = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.getInstallation, schema: installationSchema, args: { clientPath } });

export const setComponentEnabled = ({ clientPath, componentId, enabled }: SetComponentEnabledInput) =>
  invokeCommand({ command: COMMANDS.setComponentEnabled, schema: installationSchema, args: { clientPath, componentId, enabled } });
