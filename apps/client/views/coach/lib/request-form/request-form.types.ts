import type { z } from 'zod';

import type { requestFormSchema } from './request-form.schemas';

export type RequestFormValues = z.input<typeof requestFormSchema>;

export type RequestFormOutput = z.output<typeof requestFormSchema>;

export type ToCreateOrderInput = {
  values: RequestFormOutput;
  coachUserId: string;
};
