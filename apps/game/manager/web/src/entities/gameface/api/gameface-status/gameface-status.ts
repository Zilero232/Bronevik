import { invokeCommand } from '@/shared/api';
import { COMMANDS } from '@/shared/config';

import { gamefaceStatusSchema } from './gameface-status.schemas';

export const getGamefaceStatus = (clientPath: string | null) =>
  invokeCommand({ command: COMMANDS.getGamefaceStatus, schema: gamefaceStatusSchema, args: { clientPath } });
