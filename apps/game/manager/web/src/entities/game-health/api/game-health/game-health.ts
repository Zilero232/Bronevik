import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { healthReportSchema } from './game-health.schemas';

export const getGameHealth = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.getGameHealth, schema: healthReportSchema, args: { clientPath } });
