import type { Locale } from '@/shared/i18n';

import { resolveLocale } from '@/shared/i18n';

export const pathnameLocale = (pathname: string): Locale => resolveLocale(pathname.split('/')[1]);
