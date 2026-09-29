import type { ReactElement } from 'react';

import type { Locale } from '@/shared/i18n';

import type { OgLabels } from '../og-labels';

type OgImageCardInput = {
  host: string;
  labels: OgLabels;
};

export type OgImageInput = {
  locale: Locale;
  card: (input: OgImageCardInput) => Promise<ReactElement> | ReactElement;
  onError?: (error: unknown) => Response | null;
};
