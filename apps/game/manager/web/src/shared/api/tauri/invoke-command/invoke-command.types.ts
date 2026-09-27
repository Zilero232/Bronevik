import type { InvokeArgs } from '@tauri-apps/api/core';
import type { z } from 'zod';

import type { COMMANDS } from '../../../config';

export type ManagerCommand = (typeof COMMANDS)[keyof typeof COMMANDS];

export type InvokeCommandInput<Schema extends z.ZodType> = {
  command: ManagerCommand;
  schema: Schema;
  args?: InvokeArgs;
};
