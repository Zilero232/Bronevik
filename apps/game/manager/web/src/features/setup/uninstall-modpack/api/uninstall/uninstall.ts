import { patchReportSchema } from '@/entities/patch-report';
import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { UninstallRequest } from './uninstall.types';

export const uninstallModpack = (request: UninstallRequest) =>
  invokeCommand({ command: COMMANDS.uninstallModpack, schema: patchReportSchema, args: { request } });
