import type { z } from 'zod';

import type { spottingFormSchema, spottingSideSchema } from './spotting-form.schemas';

export type SpottingSideValues = z.infer<typeof spottingSideSchema>;

export type SpottingFormValues = z.infer<typeof spottingFormSchema>;
