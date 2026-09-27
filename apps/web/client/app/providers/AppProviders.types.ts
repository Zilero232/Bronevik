import type { ReactNode } from 'react';

import type { Locale } from '@/shared/i18n';

export type AppProvidersProps = {
  children: ReactNode;
  locale: Locale;
};
