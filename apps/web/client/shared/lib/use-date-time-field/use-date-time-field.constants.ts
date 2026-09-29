import type { Locale as DateLocale } from 'date-fns';

import { enUS, ru } from 'date-fns/locale';

import type { Locale } from '@/shared/i18n';

export const DATE_TIME_FIELD = {
  display: { day: 'numeric', month: 'short', weekday: 'short', hour: '2-digit', minute: '2-digit' },
  locales: { ru, en: enUS } satisfies Record<Locale, DateLocale>
} as const;
