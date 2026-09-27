import { z } from 'zod';

export const localizedSchema = z.object({ ru: z.string(), en: z.string() });
