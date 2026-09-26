import type { z } from 'zod';

import type { Guide } from '@/shared/api/guides';

import type { guideFormSchema } from './guide-form.schemas';

export type GuideFormValues = z.input<typeof guideFormSchema>;

export type GuideFormOutput = z.output<typeof guideFormSchema>;

export type GuideFormLocale = GuideFormValues['locale'];

export type ToGuideFormValuesInput = {
  guide: Guide | null;
  locale: string;
};
