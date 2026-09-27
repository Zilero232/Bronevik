import type { z } from 'zod';

import type { Locale } from '../../i18n';
import type { localizedSchema } from './localized.schemas';

export type Localized = z.infer<typeof localizedSchema>;

export type PickLocalizedInput = {
  text: Localized;
  locale: Locale;
};
