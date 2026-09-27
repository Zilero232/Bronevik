import type { UnlistenFn } from '@tauri-apps/api/event';
import type { z } from 'zod';

import { listen } from '@tauri-apps/api/event';

import type { ListenEventInput } from './listen-event.types';

export const listenEvent = <Schema extends z.ZodType>({ event, schema, onPayload }: ListenEventInput<Schema>): Promise<UnlistenFn> =>
  listen<unknown>(event, ({ payload }) => {
    const parsed = schema.safeParse(payload);

    if (parsed.success) {
      onPayload(parsed.data);
    }
  });
