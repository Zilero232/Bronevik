import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { conflictReportSchema } from './conflicts.schemas';

export const getConflicts = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.getConflicts, schema: conflictReportSchema, args: { clientPath } });

export const restoreMissing = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.restoreMissing, schema: conflictReportSchema, args: { clientPath } });
