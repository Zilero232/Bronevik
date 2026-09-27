import type { z } from 'zod';

import type { EVENTS } from '../../../config';

export type ManagerEvent = (typeof EVENTS)[keyof typeof EVENTS];

export type ListenEventInput<Schema extends z.ZodType> = {
  event: ManagerEvent;
  schema: Schema;
  onPayload: (payload: z.infer<Schema>) => void;
};
