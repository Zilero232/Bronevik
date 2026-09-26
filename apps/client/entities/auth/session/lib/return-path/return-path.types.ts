import type { LocalePathInput } from '@/shared/i18n';

export type ReturnUrlInput = LocalePathInput & {
  origin: string;
};
