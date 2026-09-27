import { z } from 'zod';

import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { appInfoSchema } from './app-info.schemas';

export const getAppInfo = () => invokeCommand({ command: COMMANDS.appInfo, schema: appInfoSchema });

export const collectLogs = () => invokeCommand({ command: COMMANDS.collectLogs, schema: z.string() });

export const revealPath = (path: string) => invokeCommand({ command: COMMANDS.revealPath, schema: z.null(), args: { path } });
