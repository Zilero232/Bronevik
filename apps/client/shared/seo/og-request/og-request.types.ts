import type { Locale } from '@/shared/i18n';

export type OgPlayerRequestInput = {
  id: string;
  locale: string | null;
};

export type OgPlayerRequest = {
  accountId: number;
  locale: Locale;
};
