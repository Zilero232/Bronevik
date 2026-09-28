import { z } from 'zod';

import { installationSchema } from '@/entities/installation';
import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { InstallRequest } from './setup.types';

import { installPlanSchema } from './setup.schemas';

export const prepareInstall = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.prepareInstall, schema: installPlanSchema, args: { clientPath } });

export const installModpack = (request: InstallRequest) =>
  invokeCommand({ command: COMMANDS.installModpack, schema: installationSchema, args: { request } });

export const readInstallerProfile = (path: string) =>
  invokeCommand({ command: COMMANDS.readInstallerProfile, schema: z.array(z.string()), args: { path } });
