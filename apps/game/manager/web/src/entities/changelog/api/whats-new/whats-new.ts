import { z } from 'zod';

import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { whatsNewSchema } from './whats-new.schemas';

export const getWhatsNew = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.getWhatsNew, schema: whatsNewSchema, args: { clientPath } });

export const markReleaseSeen = (version: string) => invokeCommand({ command: COMMANDS.markReleaseSeen, schema: z.null(), args: { version } });
