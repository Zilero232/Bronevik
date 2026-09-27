import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { patchReportSchema } from './patch-report.schemas';

export const getPatchReport = () => invokeCommand({ command: COMMANDS.getPatchReport, schema: patchReportSchema });

export const checkNow = () => invokeCommand({ command: COMMANDS.checkNow, schema: patchReportSchema });

export const updateModpack = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.updateModpack, schema: patchReportSchema, args: { clientPath } });

export const migrateModpack = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.migrateModpack, schema: patchReportSchema, args: { clientPath } });
