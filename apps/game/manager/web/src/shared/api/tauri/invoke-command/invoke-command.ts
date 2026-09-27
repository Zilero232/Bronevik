import type { z } from 'zod';

import { invoke } from '@tauri-apps/api/core';

import type { InvokeCommandInput } from './invoke-command.types';

import { toManagerError } from '../manager-error';

export const invokeCommand = async <Schema extends z.ZodType>({ command, schema, args }: InvokeCommandInput<Schema>): Promise<z.infer<Schema>> => {
  try {
    return schema.parse(await invoke<unknown>(command, args));
  } catch (error) {
    throw toManagerError(error);
  }
};
