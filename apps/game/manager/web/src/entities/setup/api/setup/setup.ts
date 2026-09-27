import { z } from 'zod';

import { installationSchema } from '@/entities/installation';
import { patchReportSchema } from '@/entities/patch-report';
import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { InstallRequest, UninstallRequest } from './setup.types';

import { installPlanSchema } from './setup.schemas';

export const prepareInstall = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.prepareInstall, schema: installPlanSchema, args: { clientPath } });

export const installModpack = (request: InstallRequest) =>
  invokeCommand({ command: COMMANDS.installModpack, schema: installationSchema, args: { request } });

export const uninstallModpack = (request: UninstallRequest) =>
  invokeCommand({ command: COMMANDS.uninstallModpack, schema: patchReportSchema, args: { request } });

export const readInstallerProfile = (path: string) =>
  invokeCommand({ command: COMMANDS.readInstallerProfile, schema: z.array(z.string()), args: { path } });
