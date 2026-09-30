import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import type { SyncNowInput } from './site-sync.types';

import { syncReportSchema, syncStatusSchema } from './site-sync.schemas';

export const getSyncStatus = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.getSyncStatus, schema: syncStatusSchema, args: { clientPath } });

export const syncNow = ({ clientPath, resolution }: SyncNowInput) =>
  invokeCommand({ command: COMMANDS.syncNow, schema: syncReportSchema, args: { clientPath, resolution } });
