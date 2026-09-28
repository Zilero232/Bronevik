import { SITE } from '@/shared/config';

export const X_DEFAULT = 'x-default';

export const THEME_COLOR = '#18181b';

export const SITE_BRAND = {
  ru: { name: SITE.name, ogLocale: SITE.locale },
  en: { name: SITE.en.title, ogLocale: SITE.en.locale }
} as const;
